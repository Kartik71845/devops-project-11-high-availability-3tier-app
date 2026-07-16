output "rds_endpoint" {
  description = "Endpoint of the MySQL RDS instance"
  value       = aws_db_instance.my_db_instance.endpoint
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.my_ecr_repo_frontend.repository_url
}

output "ecr_repository_url_backend" {
  description = "URL of the ECR repository for backend"
  value       = aws_ecr_repository.my_ecr_repo_backend.repository_url
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.my_alb.dns_name
  
}