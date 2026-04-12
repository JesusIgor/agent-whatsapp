#!/bin/bash

sudo dnf update -y
sudo dnf install -y git

sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

DOCKER_CONFIG=$${DOCKER_CONFIG:-/usr/local/lib/docker/cli-plugins}
sudo mkdir -p $DOCKER_CONFIG
curl -SL https://github.com/docker/compose/releases/download/v5.0.1/docker-compose-linux-aarch64 -o $DOCKER_CONFIG/docker-compose
sudo chmod +x $DOCKER_CONFIG/docker-compose
sudo ln -s $DOCKER_CONFIG/docker-compose /usr/local/bin/docker-compose

cd /home/ec2-user
git clone ${project_repo} app
cd app

cp .env.example .env || touch .env

sudo chown -R ec2-user:ec2-user /home/ec2-user/app

/usr/local/bin/docker-compose -f docker-compose.yml up -d --build

echo "Waiting for services to start..."
sleep 60

if curl -f http://localhost:80; then
    echo "Frontend is reachable"
else
    echo "Frontend failed to start"
fi

if curl -f http://localhost:8000/health; then
    echo "Backend is healthy"
else
    echo "Backend health check failed"
fi
