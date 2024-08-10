'''

Usermodel:                                              
{
  "_id": "ObjectId",
  "username": "String",         --> unique
  "displayName": "String",      
  "email": "String",            --> unique
  "emailVerified": "Boolean",
  "fullName": "String",     
  "profileImage": "String",
  "coverImage": "String",
  "bio": "String",
  "followers": ["ObjectId"],
  "following": ["ObjectId"],
  "password": "String",         --> Hashed
  "refreshToken": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "dateOfBirth": "Date",
  "resetPasswordToken": "String",
  "resetPasswordExpires": "Date",
  "verified": "Boolean",
  "hasBadge": "Boolean",
  "badgeRequested": "Boolean"
}


Otpverificationmodel:
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "otpCode": "String",
  "createdAt": "Date",
  "expiredAt": "Date"
}


Postmodel:                                
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String",
  "image": "String",
  "video": "String",
  "document": "String",
  "likes": ["ObjectId"],
  "comments": ["ObjectId"],
  "owner": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}



Commentmodel:       
{
  "_id": "ObjectId",
  "content": "String",
  "edited": "Boolean",
  "likes": ["ObjectId"],
  "replies": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date",
  "image": "String",
  "owner": "ObjectId"
}


Replies:
{
  "_id": "ObjectId",
  "content": "String",
  "likes": ["ObjectId"],
  "comments": ["ObjectId"],  // If these are nested replies
  "owner": "ObjectId"
}

Followersmodel:
{
  "_id": "ObjectId",
  "userId": "ObjectId",  // The user being followed
  "followerId": "ObjectId",  // The user who is following
  "followedAt": "Date"
}

Followingmodel:
{
  "_id": "ObjectId",
  "userId": "ObjectId",  // The user who is following
  "followingId": "ObjectId",  // The user being followed
  "followedAt": "Date"
}



'''