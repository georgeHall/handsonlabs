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

## Cluster Logging ##
The core cluster logs are setup when the cluster is built. This will forward logs about the general health of the cluster. 

TODO:  get the cluster log types.

All logging for the cluster can be done by applying the file `cwagent-fluentd-quickstart.yaml`. This will set up log forwarding from the cluster to cloudwatch. It is provided by amazon and stored in an s3 bucket in each region. 

