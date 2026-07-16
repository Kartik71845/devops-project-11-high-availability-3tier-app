resource "aws_ecr_repository" "my_ecr_repo_frontend" {
  name = "frontend"
  force_delete = true
}

resource "aws_ecr_repository" "my_ecr_repo_backend" {
  name = "backend"
  force_delete = true
}