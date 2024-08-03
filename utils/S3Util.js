import AWS from 'aws-sdk'
import fs from 'fs'

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3({apiVersion: '2006-03-01'});


const uploadOnAWS= async (file)=>{

    const uploadParams = {
        Bucket: 'mind-matters-bucket-aws',
        Key: file, 
        Body: fs.readFileSync(file)
      };
    
      const data = await s3.upload(uploadParams).promise();     
      console.log(data)
      return data;

}

const deleteFromAWS= async (s3Url)=>{
    if(!s3Url)
      {
        return;
      }
      
    const urlParts = s3Url.split('/');
    let bucketName = urlParts[2];
    bucketName= bucketName.split('.')[0];
    const objectKey = urlParts.slice(3).join('/');

    console.log(bucketName)
    console.log(objectKey)

    const params = {
      Bucket: bucketName,
      Key: objectKey
    };

    const data = await s3.deleteObject(params).promise();

    //console.log('Object deleted successfully:', data);

    return;
}

export {uploadOnAWS, deleteFromAWS}