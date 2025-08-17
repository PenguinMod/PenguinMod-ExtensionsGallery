# AuthPenguin Extension Documentation

The AuthPenguin extension provides OAuth authentication capabilities for your Scratch projects. This extension allows users to log in using popular platforms like Discord, Google, GitHub, Scratch, and SoundCloud, enabling you to create personalized experiences and user-specific content.

## Getting Started

### Basic Authentication

### Login with Specific Provider
```scratch
login with [discord v] :: #00c3ff
```
Authenticates the user using a specific OAuth provider. Opens a popup window for the user to complete the login process.

Available providers:
- `discord` - Discord OAuth
- `google` - Google OAuth  
- `github` - GitHub OAuth
- `scratch` - Scratch OAuth
- `soundcloud` - SoundCloud OAuth

Examples:
```scratch
login with [discord v] :: #00c3ff
login with [google v] :: #00c3ff
login with [github v] :: #00c3ff
```

### Login with Popup Selector
```scratch
login with popup selector :: #00c3ff
```
Opens a popup window with a provider selection interface, allowing users to choose their preferred authentication method.

This is useful when you want to give users a choice of multiple providers without cluttering your project with multiple login blocks.

## User Information

### Get Specific User Information
```scratch
(get user [username v] :: #00c3ff)
```
Retrieves specific information about the authenticated user.

Available information types:
- `username` - The user's display name
- `email` - The user's email address (if available)
- `id` - The user's unique ID from the provider
- `avatar` - URL to the user's profile picture

Examples:
```scratch
say (get user [username v] :: #00c3ff) for (2) seconds
set [user email v] to (get user [email v] :: #00c3ff)
```

### Get All User Information
```scratch
(get all user info as JSON :: #00c3ff)
```
Returns all available user information as a JSON string. Useful for debugging or when you need multiple pieces of information.

Example response:
```json
{
  "username": "JohnDoe",
  "email": "john@example.com",
  "id": "123456789",
  "avatar": "https://example.com/avatar.jpg",
  "provider": "discord"
}
```

### Get Used Provider
```scratch
(get used provider :: #00c3ff)
```
Returns the name of the provider that was used for authentication.

Examples:
- Returns `"discord"` if logged in via Discord
- Returns `"google"` if logged in via Google
- Returns `""` if not logged in

## Authentication Status

### Check Login Status
```scratch
<is logged in? :: #00c3ff>
```
Returns `true` if the user is currently authenticated, `false` otherwise.

Example usage:
```scratch
if <is logged in? :: #00c3ff> then
  say (join [Welcome back, ] (get user [username v] :: #00c3ff))
else
  say [Please log in to continue]
end
```

### Logout
```scratch
logout :: #00c3ff
```
Logs out the current user and clears all stored authentication data.

Example usage:
```scratch
logout :: #00c3ff
say [You have been logged out]
```

## Advanced Configuration

### Set Server URL
```scratch
set server URL to [http://localhost:3000] :: #00c3ff
```
Changes the authentication server URL. This is useful for development or when using a custom authentication server.

Default server: `https://oauth.mubilop.com`

**Note:** Only change this if you're running your own AuthPenguin server or for development purposes.

## Complete Example Projects

### Basic Login System
```scratch
when flag clicked
if <is logged in? :: #00c3ff> then
  say (join [Welcome back, ] (get user [username v] :: #00c3ff))
else
  say [Click to login]
end

when this sprite clicked
if <not <is logged in? :: #00c3ff>> then
  login with popup selector :: #00c3ff
  if <is logged in? :: #00c3ff> then
    say (join [Hello, ] (get user [username v] :: #00c3ff))
    say (join [You used ] (get used provider :: #00c3ff))
  else
    say [Login failed or cancelled]
  end
end
```

### User Profile Display
```scratch
when flag clicked
if <is logged in? :: #00c3ff> then
  set [username v] to (get user [username v] :: #00c3ff)
  set [email v] to (get user [email v] :: #00c3ff)
  set [provider v] to (get used provider :: #00c3ff)
  
  say (join [Username: ] (username))
  say (join [Email: ] (email))
  say (join [Provider: ] (provider))
end
```

### Logout Button
```scratch
when this sprite clicked
if <is logged in? :: #00c3ff> then
  logout :: #00c3ff
  say [You have been logged out]
  wait (1) seconds
  say [Click to login again]
end
```

### Provider-Specific Login
```scratch
when [d v] key pressed
login with [discord v] :: #00c3ff

when [g v] key pressed  
login with [google v] :: #00c3ff

when [h v] key pressed
login with [github v] :: #00c3ff

when [s v] key pressed
login with [scratch v] :: #00c3ff
```

## Error Handling and Troubleshooting

### Common Issues

1. **Popup Blocked**: If the login popup is blocked by the browser, users need to allow popups for your site.

2. **Login Fails**: This can happen if:
   - The user cancels the login process
   - The authentication server is down
   - The project is blocked by the server administrator

3. **Empty User Information**: Some providers may not provide all information types (especially email).

### Best Practices

1. **Always Check Login Status**: Before trying to get user information, check if the user is logged in.

2. **Handle Failed Logins**: Always check if login was successful before proceeding.

3. **Automatic Logout**: The extension automatically logs out any existing user when a new login is attempted.

4. **Project Blocking**: Server administrators can block specific projects. Check the browser console for blocking messages.

## Security and Privacy

- **No Password Storage**: AuthPenguin never stores or handles user passwords directly
- **Token-Based**: Uses secure OAuth tokens for authentication
- **Project-Specific**: Each project gets its own unique identifier
- **Automatic Cleanup**: Tokens are automatically invalidated when users log out

## Server Requirements

AuthPenguin requires an authentication server to function. The default server is https://oauth.mubilop.com

For a standalone server implementation, you can also use the AuthPenguin Server repository: https://github.com/cicerorph/AuthPenguin-Server/

## Limitations

- Requires an internet connection
- Popup blockers may interfere with the login process
- Some user information may not be available from all providers
- The extension only works in unsandboxed mode

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Ensure popups are allowed
3. Verify your internet connection
4. Try different authentication providers
