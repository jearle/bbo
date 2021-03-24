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
    subnet_ids = [var.subnetId]
  }

  environment {
    variables = {
      environment = var.environment
    }
  }
}

# ****** COGNITO ******
resource "aws_cognito_user_pool" "default" {
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
  }
  email_verification_message = "Your verification code is {####}. "
  email_verification_subject = "Your verification code"

  lambda_config {
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
  }
}

resource "aws_cognito_resource_server" default {
  name = "cd_product_api_${var.environment}_cognito_resource_server"
  // TODO: figure out what this actually is and whether it can be split out into an env-based config variable or needs to be this url
  identifier = "https://cd-product-api.rcanalytics.com"

  scope {
    scope_name = "company.read"
    scope_description = "Read company details"
  }

  user_pool_id = aws_cognito_user_pool.default.id
}

resource "aws_cognito_user_pool_client" "default" {
  name = "cd_product_api_${var.environment}_cognito_user_pool_client"

  user_pool_id = aws_cognito_user_pool.default.id

  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "email",
    "https://cd-product-api.rcanalytics.com/company.read",
    "openid",
    "phone",
    "profile"
  ]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  callback_urls = [
    "https://www.example.com"
  ]

  prevent_user_existence_errors = "ENABLED"

  supported_identity_providers = ["COGNITO"]

  access_token_validity = 60
  id_token_validity = 60
  refresh_token_validity = 30
  token_validity_units {
    access_token = "minutes"
    id_token = "minutes"
    refresh_token = "days"
  }

  generate_secret = true
}
