# Firebase Configuration Instructions for Gooma United Website

## Issue Resolution
The website is experiencing Firebase permission errors that need to be resolved. Here are the steps to configure Firebase properly:

## 1. Firebase Security Rules Configuration

### Firestore Database Rules
You need to configure the Firestore Security Rules in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sagachat-3cfaf`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents for authenticated users
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow write access to matches collection for authenticated users
    match /matches/{matchId} {
      allow write: if request.auth != null;
    }
    
    // Allow write access to players collection for authenticated users
    match /players/{playerId} {
      allow write: if request.auth != null;
    }
    
    // Allow write access to news collection for authenticated users
    match /news/{newsId} {
      allow write: if request.auth != null;
    }
    
    // Allow write access to venues collection for authenticated users
    match /venues/{venueId} {
      allow write: if request.auth != null;
    }
    
    // Allow users to read and write their own player profile
    match /players/{playerId} {
      allow read, write: if request.auth != null && request.auth.token.email == resource.data.email;
    }
  }
}
```

5. Click **Publish** to save the rules

### Alternative: Development Rules (Less Secure)
If you want to allow all read/write operations for testing purposes, you can use these rules temporarily:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning:** These rules allow anyone to read/write your database. Only use for development/testing.

## 2. Firebase Authentication Setup

### Enable Email/Password Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

### Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - **Email:** `tibo@indii.be`
   - **Password:** `tibo123`
4. Click **Add user**

### Alternative: Create User Programmatically
You can also create the admin user using the Firebase Admin SDK or through the website's registration flow.

## 3. Firebase Storage Rules (Optional)
If you plan to use Firebase Storage for file uploads:

1. Go to **Storage** → **Rules**
2. Use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Testing the Configuration

After applying these changes:

1. Wait 1-2 minutes for the rules to propagate
2. Refresh the website
3. Try logging in with: `tibo@indii.be` / `tibo123`
4. Check if data loads properly on all pages

## 5. Troubleshooting

### If login still fails:
- Verify the user exists in Firebase Authentication
- Check that Email/Password provider is enabled
- Ensure the password is correct

### If data still doesn't load:
- Verify Firestore rules are published
- Check browser console for specific error messages
- Ensure the Firebase project ID matches in the configuration

### Common Issues:
- **"Missing or insufficient permissions"** → Check Firestore rules
- **"auth/invalid-credential"** → Check if user exists and credentials are correct
- **"auth/user-not-found"** → Create the admin user in Firebase Authentication

## 6. Production Recommendations

For production use, consider:
- More restrictive security rules
- Role-based access control
- Input validation
- Rate limiting
- Backup strategies

## 7. Contact Information

If you need assistance with Firebase configuration, you can:
- Check Firebase documentation
- Use Firebase support channels
- Review the error logs in browser console

---

**Next Steps:**
1. Apply the Firestore security rules
2. Create the admin user
3. Test the website functionality
4. Verify all features work correctly

