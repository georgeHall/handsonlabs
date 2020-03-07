## Elastic Container Registry

First we are looking at ECR, which is used to store the docker images that we will be using when operating on AWS. We will be building the images locally, then creating a repository and pushing them to the remote repository. These containers will be used later on in the session. 

# Steps
1. Build the images in both the frontend and backend applications. 
    `cd frontend && docker build --tag frontend:latest .`
    `cd ../backend && docker build --tag backend:latest .`
2. Create a Repository for your images in the ECR registry. 
    a. Navigate to ECR. 
    b. Click on Repositories
    c. Create repository. (Create one for both you front end and backend images. These should be named uniquely in the registry, therefore you should add your name to each one) e.g. george-frontend, george-backend
3. Tag the images locally on your Laptop
    `docker tag frontend:latest {repo uri}/{frontend repo name}:latest`
    `docker tag backend:latest {repo uri}/{backend repo name}:latest`
4. Push the images to the remote repository.
    `aws ecr get-login` returns a docker command to login to ECR or just `$(aws ecr get-login)` to evaluate the returned string
        This may throw and an error `unknown shorthand flag: 'e' in -e` in that case run `aws ecr get-login` then remove `-e none` from the response before pasting it into the command line.
    AWS CLI 2:
        `aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 632354576168.dkr.ecr.ap-southeast-2.amazonaws.com`
    `docker push {repo uri}/{frontend repo name}:latest`
    `docker push {repo uri}/{backend repo name}:latest`
    
If you enables scan on push. You can login to the AWS console and view the CVE issues. These will indicate the severity of the issues and the Issue number which can be remediated.

If the the tag immuntibility is added you will not be able to overwrite any of the pushed image tags.
