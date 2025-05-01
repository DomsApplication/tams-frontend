variable "aws_region" {
    description = "AWS region"
    type = string
    default = "ap-south-1"
}

variable "stack_name" {
  description = "The stack name of the project"
  type = string
  default = "shavika"
}

variable "github_owner" {
    description = "github repository owner"
    type = string
}

variable "deploy_env" {
    description = "deployment environment"
    type = string
    default = "dev"
}

variable "deploy_repo" {
    description = "deployment github repository"
    type = string
}

variable "product" {
    description = "project name tag"
    type = string
    default = "DOMS" 
}

variable "product_version" {
  description = "product verison tag"
  type = string
  default = "1.0.0"
}

variable "customer_name" {
  description = "customer name tag"
  type = string
  default = "epd"
}

variable "revenue_type" {
    description = "revenue type tag"
    type = string
    default = "non-rev" 
}

variable "requestor_name" {
    description = "requestor name tag"
    type = string
    default = ""
}

variable "pipeline_token" {
  description = "Github token passed in from CI workflow"
  type = string
  default = ""
}

variable "data_source_name" {
  type        = string
  default = "doms"
  description = "DynamoDB service name for data repository with all tenant base."
}
