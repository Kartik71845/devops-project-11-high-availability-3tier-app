resource "aws_sns_topic" "send_notification" {
  name = "send_notification"
}

resource "aws_sns_topic_subscription" "send_notification_subscription" {
  topic_arn = aws_sns_topic.send_notification.arn
  protocol  = "email"
  endpoint  = "kartikrajkumarb@gmail.com"
}

resource "aws_cloudwatch_metric_alarm" "high_cpu_utilization" {
  alarm_name          = "high_cpu_utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"

  alarm_description   = "This metric monitors EC2 CPU utilization"
  alarm_actions       = [aws_sns_topic.send_notification.arn]
}

resource "aws_cloudwatch_metric_alarm" "frontend_target_host_count" {
  alarm_name          = "frontend_target_host_count"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = "120"
  statistic           = "Average"
  threshold           = "1"

  alarm_description   = "This metric monitors the number of healthy hosts in the frontend target group"
  alarm_actions       = [aws_sns_topic.send_notification.arn]
}

resource "aws_cloudwatch_metric_alarm" "backend_target_host_count" {
  alarm_name          = "backend_target_host_count"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = "120"
  statistic           = "Average"
  threshold           = "1"

  alarm_description   = "This metric monitors the number of healthy hosts in the backend target group"
  alarm_actions       = [aws_sns_topic.send_notification.arn]
}

resource "aws_cloudwatch_metric_alarm" "rds_cpu_utilization" {
  alarm_name          = "rds_cpu_utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"

  alarm_description   = "This metric monitors RDS CPU utilization"
  alarm_actions       = [aws_sns_topic.send_notification.arn]
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "3tier-dashboard"

  dashboard_body = jsonencode({
    widgets = [

      {
        "type" : "metric",
        "x" : 0,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "Frontend ASG CPU Utilization",
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/EC2",
              "CPUUtilization",
              "AutoScalingGroupName",
              aws_autoscaling_group.frontend_asg.name
            ]
          ]
        }
      },

      {
        "type" : "metric",
        "x" : 12,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "Backend ASG CPU Utilization",
          "view" : "timeSeries",
          "stacked" : false,
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/EC2",
              "CPUUtilization",
              "AutoScalingGroupName",
              aws_autoscaling_group.backend_asg.name
            ]
          ]
        }
      },

      {
        "type" : "metric",
        "x" : 0,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "Frontend Healthy Hosts",
          "view" : "timeSeries",
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HealthyHostCount",
              "TargetGroup",
              aws_lb_target_group.frontend.arn_suffix,
              "LoadBalancer",
              aws_lb.my_alb.arn_suffix
            ]
          ]
        }
      },

      {
        "type" : "metric",
        "x" : 12,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "Backend Healthy Hosts",
          "view" : "timeSeries",
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "HealthyHostCount",
              "TargetGroup",
              aws_lb_target_group.backend.arn_suffix,
              "LoadBalancer",
              aws_lb.my_alb.arn_suffix
            ]
          ]
        }
      },

      {
        "type" : "metric",
        "x" : 0,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "Application Load Balancer Requests",
          "view" : "timeSeries",
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/ApplicationELB",
              "RequestCount",
              "LoadBalancer",
              aws_lb.my_alb.arn_suffix
            ]
          ]
        }
      },

      {
        "type" : "metric",
        "x" : 12,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "title" : "RDS CPU Utilization",
          "view" : "timeSeries",
          "region" : "us-east-1",
          "metrics" : [
            [
              "AWS/RDS",
              "CPUUtilization",
              "DBInstanceIdentifier",
              aws_db_instance.my_db_instance.identifier
            ]
          ]
        }
      }

    ]
  })
}