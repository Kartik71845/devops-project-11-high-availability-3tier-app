resource "aws_ecr_repository" "my_ecr_repo_frontend" {
  name = "frontend"
}

resource "aws_ecr_repository" "my_ecr_repo_backend" {
  name = "backend"
}