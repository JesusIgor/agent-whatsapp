import type { Select } from 'node-sql-parser'

/** Política de tenant no WHERE/HAVING via AST (complementa heurísticas em sqlValidator). */

function unwrapCteStmt(stmt: unknown): Select | null {
  if (!stmt || typeof stmt !== 'object') return null
  const s = stmt as { type?: string; ast?: Select }
  if (s.type === 'select') return s as Select
  if (s.ast?.type === 'select') return s.ast
  return null
}

function cteName(w: { name?: { value?: string; type?: string } | string }): string {
  const n = w.name
  if (typeof n === 'string') return n.toLowerCase()
  if (n && typeof n === 'object' && n.value != null) return String(n.value).toLowerCase()
  return ''
}

function columnName(node: unknown): string | null {
  if (!node || typeof node !== 'object') return null
  const n = node as { type?: string; column?: { expr?: { value?: unknown } } | string }
  if (n.type !== 'column_ref') return null
  const c = n.column
  if (typeof c === 'string') return c.toLowerCase()
  const v = c && typeof c === 'object' && c.expr && typeof c.expr === 'object' && 'value' in c.expr! ? (c.expr as { value: unknown }).value : null
  return v != null ? String(v).toLowerCase() : null
}

function literalNumberOrString(node: unknown): string | null {
  if (node == null || typeof node !== 'object') return null
  const n = node as { type?: string; value?: unknown }
  if (n.type === 'number' && n.value != null) return String(n.value)
  if (
    n.type === 'single_quote_string' ||
    n.type === 'double_quote_string' ||
    n.type === 'default' ||
    n.type === 'bool' ||
    n.type === 'boolean'
  ) {
    return String(n.value)
  }
  return null
}

function literalMatchesCompanyId(node: unknown, companyId: number): boolean {
  const s = literalNumberOrString(node)
  if (s === null) return false
  return Number(s) === companyId || s === String(companyId)
}

function isCompanyIdEquality(node: unknown, companyId: number): boolean {
  if (!node || typeof node !== 'object') return false
  const n = node as { type?: string; operator?: string; left?: unknown; right?: unknown }
  if (n.type !== 'binary_expr') return false
  const op = String(n.operator).toUpperCase()
  if (op === '=' || op === '==') {
    return columnName(n.left) === 'company_id' && literalMatchesCompanyId(n.right, companyId)
  }
  if (op === 'IN') {
    if (columnName(n.left) !== 'company_id') return false
    const right = n.right as { type?: string; value?: unknown[] }
    if (!right || right.type !== 'expr_list' || !Array.isArray(right.value)) return false
    if (right.value.length !== 1) return false
    return literalMatchesCompanyId(right.value[0], companyId)
  }
  return false
}

function isOrNode(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const n = node as { type?: string; operator?: string }
  return n.type === 'binary_expr' && String(n.operator).toUpperCase() === 'OR'
}

function flattenAndConjuncts(node: unknown): unknown[] {
  if (node == null) return []
  const n = node as { type?: string; operator?: string; left?: unknown; right?: unknown }
  if (n.type === 'binary_expr' && String(n.operator).toUpperCase() === 'AND') {
    return [...flattenAndConjuncts(n.left), ...flattenAndConjuncts(n.right)]
  }
  return [node]
}

/** WHERE deve implicar isolamento ao tenant: em ramos OR cada lado precisa ser seguro; em AND basta um `company_id = <tenant>`. */
export function isWhereTenantSafe(where: unknown, companyId: number): boolean {
  if (where == null) return false
  if (isOrNode(where)) {
    const w = where as { left: unknown; right: unknown }
    return isWhereTenantSafe(w.left, companyId) && isWhereTenantSafe(w.right, companyId)
  }
  for (const t of flattenAndConjuncts(where)) {
    if (isCompanyIdEquality(t, companyId)) return true
    if (isOrNode(t)) {
      const o = t as { left: unknown; right: unknown }
      if (!(isWhereTenantSafe(o.left, companyId) && isWhereTenantSafe(o.right, companyId))) return false
    }
  }
  return false
}

function walkExpr(node: unknown, visit: (n: Record<string, unknown>) => void): void {
  if (node == null || typeof node !== 'object') return
  const n = node as Record<string, unknown>
  visit(n)
  if ('left' in n && n.left) walkExpr(n.left, visit)
  if ('right' in n && n.right) walkExpr(n.right, visit)
  if (n.type === 'expr_list' && Array.isArray(n.value)) {
    for (const x of n.value as unknown[]) walkExpr(x, visit)
  }
  if (n.type === 'case' && Array.isArray(n.args)) {
    for (const br of n.args as { cond?: unknown; result?: unknown }[]) {
      if (br.cond) walkExpr(br.cond, visit)
      if (br.result) walkExpr(br.result, visit)
    }
  }
}

/** Bloqueia `company_id <> …`, `LIKE`, subqueries em comparação com company_id, etc. */
export function illegalCompanyIdPredicateMessage(where: unknown, companyId: number): string | null {
  if (where == null) return null
  let bad: string | null = null
  walkExpr(where, (n) => {
    if (bad || n.type !== 'binary_expr') return
    const op = String(n.operator).toUpperCase()
    const leftName = columnName(n.left)
    if (leftName !== 'company_id') return
    if (op === '=' || op === '==') {
      if (!literalMatchesCompanyId(n.right, companyId)) {
        bad = `company_id deve ser igual a ${companyId} nesta consulta.`
      }
      return
    }
    if (op === 'IN') {
      const right = n.right as { type?: string; value?: unknown[] }
      if (right?.type === 'expr_list' && Array.isArray(right.value) && right.value.length === 1 && literalMatchesCompanyId(right.value[0], companyId)) {
        return
      }
      bad = 'Use apenas company_id = <sua empresa> (ou IN com um único valor igual ao da empresa).'
      return
    }
    bad = 'Comparações não permitidas na coluna company_id.'
  })
  return bad
}

function normalizeFrom(from: unknown): unknown[] {
  if (from == null) return []
  if (Array.isArray(from)) return from
  if (typeof from === 'object' && from !== null && 'expr' in from) return [from]
  return []
}

function hasSetOpChain(sel: Select): boolean {
  let cur: Select | null | undefined = sel
  while (cur) {
    if (cur.set_op) return true
    cur = cur._next as Select | undefined
  }
  return false
}

function validateSelectTenant(sel: Select, inheritedCtes: Set<string>, companyId: number, allowed: Set<string>): string | null {
  if (hasSetOpChain(sel)) {
    return 'UNION, INTERSECT e EXCEPT não são permitidos.'
  }

  let ctesForBodies = new Set(inheritedCtes)
  const withList = sel.with
  if (Array.isArray(withList)) {
    for (const w of withList) {
      const inner = unwrapCteStmt((w as { stmt?: unknown }).stmt)
      if (inner) {
        const err = validateSelectTenant(inner, ctesForBodies, companyId, allowed)
        if (err) return err
      }
      const name = cteName(w as { name?: { value?: string } })
      if (name) ctesForBodies.add(name)
    }
  }

  return validatePhysicalFromAndWhere(sel, ctesForBodies, companyId, allowed)
}

function validatePhysicalFromAndWhere(sel: Select, cteNames: Set<string>, companyId: number, allowed: Set<string>): string | null {
  const fromList = normalizeFrom(sel.from)
  let needsTenantOnThisSelect = false

  for (const item of fromList) {
    if (!item || typeof item !== 'object') continue
    const row = item as { expr?: { ast?: Select }; table?: string }
    if (row.expr?.ast?.type === 'select') {
      const err = validateSelectTenant(row.expr.ast, cteNames, companyId, allowed)
      if (err) return err
      continue
    }
    const t = row.table
    if (t == null) continue
    const tl = String(t).toLowerCase()
    if (tl === 'dual') continue
    if (cteNames.has(tl)) continue
    if (allowed.has(tl)) needsTenantOnThisSelect = true
  }

  if (!needsTenantOnThisSelect) return null

  if (!isWhereTenantSafe(sel.where, companyId)) {
    return `A query deve garantir isolamento por empresa (company_id = ${companyId}) em cada parte que acessa tabelas de dados.`
  }
  const illegal = illegalCompanyIdPredicateMessage(sel.where, companyId)
  if (illegal) return illegal

  if (sel.having) {
    const hav = Array.isArray(sel.having) ? sel.having[0] : sel.having
    if (hav && typeof hav === 'object') {
      const ih = illegalCompanyIdPredicateMessage(hav, companyId)
      if (ih) return ih
    }
  }

  return null
}

export function validateAstTenantPolicy(ast: Select, companyId: number, allowed: Set<string>): { ok: true } | { ok: false; message: string } {
  const err = validateSelectTenant(ast, new Set(), companyId, allowed)
  if (err) return { ok: false, message: err }
  return { ok: true }
}
