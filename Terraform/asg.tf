resource "aws_autoscaling_group" "frontend_asg" {
  name                      = "frontend-asg"
  max_size                  = 3
  min_size                  = 1
  desired_capacity          = 2
  vpc_zone_identifier       = [aws_subnet.public.id, aws_subnet.public_2.id]
  health_check_type         = "EC2"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.frontend_template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "frontend-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_attachment" "frontend_asg_attachment" {
  autoscaling_group_name = aws_autoscaling_group.frontend_asg.name
  lb_target_group_arn   = aws_lb_target_group.frontend.arn
}

resource "aws_autoscaling_group" "backend_asg" {
  name                      = "backend-asg"
  max_size                  = 3
  min_size                  = 1
  desired_capacity          = 2
  vpc_zone_identifier       = [aws_subnet.private.id, aws_subnet.private_2.id]
  health_check_type         = "EC2"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.backend_template.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "backend-instance"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_attachment" "backend_asg_attachment" {
  autoscaling_group_name = aws_autoscaling_group.backend_asg.name
  lb_target_group_arn   = aws_lb_target_group.backend.arn
}