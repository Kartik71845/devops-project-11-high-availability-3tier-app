resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.private_2.id]

  tags = {
    Name = "my-db-subnet-group"
  }
}

resource "aws_db_instance" "my_db_instance" {
  identifier              = "my-db-instance"
  allocated_storage       = 20
  storage_type            = "gp2"
  engine                  = "mysql"
  engine_version          = "8.0"
  instance_class          = "db.t3.micro"
  db_name                 = "Mydatabase"
  username                = "kartik"
  password                = "Kartik9*#"
  db_subnet_group_name    = aws_db_subnet_group.my_db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.my_sql_sg.id]
  skip_final_snapshot     = true
  publicly_accessible     = false
}

