## Elastic Container Service. 
Amazons propriotoray container orchestration service similar to Kubernetes but faster to get started. It can be run on AWS Fargate or privately managed EC2 instances. We will be running on fargate to reduce the amount of work for us. 

First we will have to create a task definition, which will maintin all the parameters that you will require in order to run your containers.
1. Select the launch type: Fargate. 
2. Start filling out the paramets.
    a. Task name:  Should be unique to you. 
    b. Task Role: ecsTaskExecutionRole
    c. Network Mode: awsvpc
    d. Task execution IAM role: ecsTaskExecutionRole
    e. Memory/CPU, 0.5GB, 0.25vCPU
    f. Tags: Owner -> Your Name
    g. Container Definitions:
        Continer name: arbitrary, call it something obvious. 
        
