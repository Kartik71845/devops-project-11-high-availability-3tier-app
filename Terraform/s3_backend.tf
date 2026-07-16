terraform {
    backend "s3" {
        bucket         = "my-terraform-state-bucket071845"
        key            = "Terraform/terraform.tfstate"
        encrypt   = true
        use_lockfile = true
        region         = "us-east-1"

    }
}