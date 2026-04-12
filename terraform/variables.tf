variable "aws_region" {
  description = "AWS Region to deploy resources"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Name of the project used for tagging resources"
  type        = string
  default     = "auzap-monolito"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "my_ip" {
  description = "Your IP address for SSH access (CIDR format)"
  type        = string
  default     = "143.255.227.39/32"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t4g.xlarge"
}

# Variable "ami_id" removed as we are using data source to fetch latest Amazon Linux 2023

variable "key_name" {
  description = "Name of the SSH key pair to access the instance"
  type        = string
}

variable "volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 50
}

variable "project_repo" {
  description = "URL of the git repository to clone"
  type        = string
  default     = "https://github.com/auzap-monolito/auzap-monolito.git"
}
