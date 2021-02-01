# ****** IAM RESOURCES ******
resource "aws_iam_role_policy" "cognito" {
  name = "cd_product_api_${var.environment}_cognito_lambda_function_iam_role_policy"
  role = aws_iam_role.cognito.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AttachNetworkInterface",
        "ec2:CreateNetworkInterface",
        "ec2:DeleteNetworkInterface",
        "ec2:DescribeNetworkInterfaces"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role" "cognito" {
  name = "cd_product_api_${var.environment}_cognito_lambda_function_iam_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }
  ]
}
EOF
}

# ****** SECURITY RESOURCES ******
resource "aws_security_group" "lambda" {
  name   = "cd_product_api_${var.environment}_lambda_security_group"
  vpc_id = var.vpcId
}

resource "aws_security_group_rule" "lambda_egress_all" {
  from_port                = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.lambda.id
  to_port                  = 0
  type                     = "egress"
  cidr_blocks              = ["0.0.0.0/0"]
}

# ****** LAMBDA FUNCTIONS ******
resource "aws_lambda_function" "cognito_pre_auth" {
  function_name = "cd_product_api_${var.environment}_cognito_pre_auth_lambda_function"
  role          = aws_iam_role.cognito.arn
  handler       = "cognito.preAuthentication"

  filename         = "../lambda/dist/package.zip"
  source_code_hash = base64sha256("../lambda/dist/package.zip")

  runtime = "nodejs12.x"
  timeout = 60

  vpc_config {
    security_group_ids = [aws_security_group.lambda.id]
    subnet_ids = [var.subnet]
  }

  environment {
    variables = {
      environment = var.environment
    }
  }
}

resource "aws_lambda_function" "cognito_user_migration" {
  function_name = "cd_product_api_${var.environment}_cognito_user_migration_lambda_function"
  role          = aws_iam_role.cognito.arn
  handler       = "cognito.userMigration"

  filename         = "../lambda/dist/package.zip"
  source_code_hash = base64sha256("../lambda/dist/package.zip")

  runtime = "nodejs12.x"
  timeout = 60

  vpc_config {
    security_group_ids = [aws_security_group.lambda.id]
    subnet_ids = [var.subnet]
  }

  environment {
    variables = {
      environment = var.environment
    }
  }
}