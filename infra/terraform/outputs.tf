output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.default.id
}

output "cognito_app_client_id" {
  value = aws_cognito_user_pool_client.default.id
}

output "cognito_app_client_secret" {
  value = aws_cognito_user_pool_client.default.client_secret
}