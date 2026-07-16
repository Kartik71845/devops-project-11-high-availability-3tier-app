resource "aws_launch_template" "frontend_template" {
  name          =     "frontend-template"
  image_id      = "ami-0b6d9d3d33ba97d99" # Replace with your desired AMI ID
  instance_type = "t3.micro"

  iam_instance_profile {
    name = aws_iam_instance_profile.ecr_access_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.frontend_sg.id]
  }

  user_data = base64encode( <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              apt-get install -y awscli
              systemctl enable --now docker
              aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 783490811281.dkr.ecr.us-east-1.amazonaws.com           
              docker pull 783490811281.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
              docker run -d -p 80:80 783490811281.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
              EOF
  )

  tags = {
    Name = "frontend-instance"
  }
}

resource "aws_launch_template" "backend_template" {
  name          =     "backend-template"
  image_id      = "ami-0b6d9d3d33ba97d99" # Replace with your desired AMI ID
  instance_type = "t3.micro"

  iam_instance_profile {
    name = aws_iam_instance_profile.ecr_access_instance_profile.name
  }

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.backend_sg.id]
  }

  user_data = base64encode( <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              apt-get install -y awscli
              systemctl enable --now docker
              cat > .env <<EOL
              DB_NAME=Mydatabase
              DB_HOST=${aws_db_instance.my_db_instance.address}
              DB_PORT=3306
              DB_USER=kartik
              DB_PASSWORD="Kartik9*#"
              EOL
              aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 783490811281.dkr.ecr.us-east-1.amazonaws.com
              docker pull 783490811281.dkr.ecr.us-east-1.amazonaws.com/backend:latest
              docker run -d -p 5000:5000 --env-file .env 783490811281.dkr.ecr.us-east-1.amazonaws.com/backend:latest
              EOF 
  )

  tags = {
    Name = "backend-instance"
  }
}