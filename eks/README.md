### EKS Cluster ### 

## Configuring Kubectl access ##
To configure access to the cluster via kubectl you can use the aws cli to update your kubeconfig automatically. 
This can be done by running the command `aws eks update-kubeconfig --region << AWS REGION >> --name << CLUSTER NAME >>` 

Providing you have access to the cluster you should now be able to run a command to view the cluster details.
`kubectl get all --all-namespaces` 

## Cluster Access Permissions ##
By default in the EKS cluster the only role/user that has access is the user that created the cluster. If this is through the console this will be the user, if performed by a CI pipeline this will be the user of the pipeline. 

To allow access we have run the `ConfigMap.yaml` to allow other users to access the cluster. 

``` yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: << NODE IAM ROLE >>
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
    - rolearn: << ROLE ARN for access to the cluster >>
      username: << Username that will be associated with the role >>
      groups:
        - system:masters
  mapUsers: |
    - userarn: << IAM role of a user >>
      username: << User name taht will be associated in EKS logs. >>
      groups:
        - system:masters
```

When configuring the permissions there are two access types Role and User access, these can be seen in the `mapRoles` and `mapUsers` blocks respectivly. 
    In the roles section the rolearn should be in the format `arn:aws:iam::<< ACCOUNT NUMBER >>:role/<< ROLE NAME >>`
    In the users section the userarn should be in the format `arn:aws:iam::<< ACCOUNT NUMBER >>:user/<< USERNAME >>`

The value `<< NODE IAM ROLE >>` has to be replaced with the IAM role arn that is attached to the nodes that provide the compute for the cluster. No the username has to be as shown with the `{{EC2PrivateDNSName}}` this is used internally and will cause issues if changed. 

When applying this initially the user or role that was used to build the cluster must run a command similiar to `kubectl apply -f ConfigMap.yaml`

If you have access the command `kubectl get -n kube-system configmap/aws-auth` will show you the user and role access permissions of the cluster. 
 
The `<< NODE IAM ROLE >>` used should have acces to manage the cluster and pull images from the ECR repository. 


## Cluster Logging ##
The core cluster logs are setup when the cluster is built. This will forward logs about the general health of the cluster. 

TODO:  get the cluster log types.

All logging for the cluster can be done by applying the file `cwagent-fluentd-quickstart.yaml`. This will set up log forwarding from the cluster to cloudwatch. It is provided by amazon and stored in an s3 bucket in each region. 

## Deployments ##
Previously you should have pushed the fronted and backend images to ECR. We will now use those images to build two services that will be accessiable through a load balancer. In the application directory there are four yaml files. These each deploy a different tool for the application. 

# Deployment yaml files #
The deployment yaml files will create a deployment for the backend and frontend respectivly. This will manage the number of pods that we request of the specifc type and start and failed pods as required. 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  selector:
    matchLabels:
      run: backend
  replicas: 1
  template:
    metadata:
      labels:
        run: backend
    spec:
      containers:
      - name: backend
        image: << IMAGE URI >>
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

The frontend `HOST` environment parameter specifies the backends service this allows the pods to communicate via the EKS internal DNS, therefore no traffic will leave the cluster. 

# Service yaml files #
The service files wil allow other services or users to access the pods. The frontend will expose a load balancer. This will be create by default across the subnets that the cluster is deployed into. 

The backend creates a NodePort service, this will allow pods within the cluster to access the service but nothing outside it. 

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    run: frontend
spec:
  ports:
  - port: 8080
    protocol: TCP
  selector:
    run: frontend
  type: LoadBalancer
```

To deploy the applications you should run 
`kubectl apply -f ./application/backend_deployment.yaml && kubectl apply -f ./application/frontend_deployment.yaml && kubectl apply -f ./application/backend_service.yaml && kubectl apply -f ./application/frontend_service.yaml`


You can query the cluster with the command `kubectl get all` (No namespace is required as they are in the default one)
This will show you the load balancer you are able to connect with.