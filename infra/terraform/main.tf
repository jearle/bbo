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

# Cognito User Pool

resource "aws_ses_email_identity" "cognito_email_identity" {
  email = var.cognitoEmail
}

resource "aws_cognito_user_pool" "cognito_user_pool" {
  name = "cd_product_api_${var.environment}_cognito_user_pool"

  admin_create_user_config {
    allow_admin_create_user_only = false
    invite_message_template {
      email_message = "Your username is {username} and temporary password is {####}. "
      email_subject = "Your temporary password"
      sms_message = "Your username is {username} and temporary password is {####}. "
    }
  }

  auto_verified_attributes = ["email"]

  device_configuration {
    challenge_required_on_new_device = false
    device_only_remembered_on_user_prompt = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
    // TODO: check if this is needed with COGNITO_DEFAULT type (was set to aromito identity on import)
    source_arn = aws_ses_email_identity.cognito_email_identity.arn
  }
  email_verification_message = "Your verification code is {####}. "
  email_verification_subject = "Your verification code"

  lambda_config {
    // TODO: should preauth lambda also be wired up?
//    pre_authentication = ""
    user_migration = aws_lambda_function.cognito_user_migration.arn
  }

  password_policy {
    minimum_length = 8
    require_numbers = true
    require_symbols = true
    require_uppercase = true
    require_lowercase = true
    temporary_password_validity_days = 7
  }

  schema {
    attribute_data_type = "String"
    name = "email"
    required = true
    developer_only_attribute = false
    mutable = true
    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  sms_authentication_message = "Your authentication code is {####}. "
  sms_verification_message = "Your verification code is {####}. "

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message = "Your verification code is {####}. "
    email_subject = "Your verification code"
    sms_message = "Your verification code is {####}. "
  }
}
