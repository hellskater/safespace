# SafeSpace

![editor-screenshot](https://github.com/hellskater/safespace/assets/47584722/da2316f1-a1f8-4088-9fe9-a5e54658d047)

## Description

The whole idea of SafeSpace is to build a suite of tools and technologies which are powered by [Pangea](https://pangea.cloud/) security services, to provide users a secure and private environment while browsing the internet.

## SafeSpace Browser Extension

The SafeSpace browser extension is a companion tool that provides users with a secure and private browsing experience. The extension is powered by Pangea security services and provides users with the following features:

- **Site Security**: Every website you visit is analyzed by Pangea security services to ensure that it is not a known malicious site. On top of that the extension also checks whether the site implements some of the best securty practises like security headers, etc. All these information is evaluated in an algorithm to provide a security score for the website. This score is then displayed to the user in the form of a badge on the extension icon. And a complete report can be viewed by clicking on the extension icon.

![Screenshot 2024-04-28 at 4 19 54 PM](https://github.com/hellskater/safespace/assets/47584722/37c2bd79-1239-4e08-9e55-efea677624b4)
![Screenshot 2024-04-28 at 4 20 59 PM](https://github.com/hellskater/safespace/assets/47584722/3413c889-0e4a-4ce9-a4f1-111ca3cd86b1)

- **Link Verification**: The extension also provides users with the ability to verify the authenticity of a link before clicking on it through the context menu. The extension will analyze the link and provide the user with a feedback on whether the link is safe to visit or not.

- **Password Breach Detection**: The extension also provides users with the ability to check if their password has been breached in any known data breaches. The extension will analyze the password and provide the user with a feedback on whether the password has been breached or not, and if it has then how many times.

- **Local Cache**: All the above feature results are stored in the local cache of the extension, so that the user can view the results even when they are offline, the next time they visit the website or check the password.

### Pangea Services Used

- [Domain Intel](https://pangea.cloud/services/domain-intel/reputation/) - Used to check the reputation of the website.
- [URL Intel](https://pangea.cloud/services/url-intel/) - Used to check the authenticity of the link.
- [User Intel](https://pangea.cloud/services/user-intel/) - Used to check if the password has been breached.

You can download the extension from the [here](https://github.com/hellskater/safespace/releases/download/v1/chrome-mv3-prod.zip).

## SafeSpace Webapp

![Screenshot 2024-04-28 at 4 31 03 PM](https://github.com/hellskater/safespace/assets/47584722/67b7ca8f-5647-4ad4-8d35-591473202476)

The SafeSpace webapp is a platform for secure note-taking which provides end-to-end encryption for the notes. The webapp is powered by Pangea security services and provides users with the following features:

- **Secure Notes**: The webapp provides users with the ability to create secure notes which are end-to-end encrypted. The notes are encrypted on the client-side and then stored on the server. The notes can only be decrypted by the user who created them.

- **WYSIWYG Editor**: The webapp provides users with a WYSIWYG editor like Notion to create notes. The editor supports various formatting options like bold, italic, underline, etc.

- **AI assistant**: The webapp also provides users with an AI assistant to improve their productivity. The AI assistant can help users with various tasks like improving their writing, summarizing text, etc.

- **Privacy**: User's personal data is never sent in the prompts to the AI assistant. The AI assistant only receives the text that is redacted of user's personal data using the Pangea redaction service.

- **Key Rotation**: The webapp also provides users with the ability to rotate their encryption keys. This is useful in case the user suspects that their encryption keys have been compromised, all the existing notes will be re-encrypted with the new encryption key.

### Pangea Services Used

- [AuthN](https://pangea.cloud/services/authn/) - Used to authenticate the user with two-factor authentication like OTP or google authenticator.

- [Redact](https://pangea.cloud/services/redact/) - Used to redact the user's personal data before sending it to the AI assistant.

- [Vault](https://pangea.cloud/services/vault/) - Used to securely store the user's encryption keys.

## Development

<!-- @repo/eslint-config - https://github.com/hellskater/safespace/tree/main/packages/eslint-config -->

- [extension](https://github.com/hellskater/safespace/tree/main/apps/extension) - Browser extension for SafeSpace.

- [webapp](https://github.com/hellskater/safespace/tree/main/apps/safespace-web) - Webapp for SafeSpace.

- [@repo/eslint-config](https://github.com/hellskater/safespace/tree/main/packages/eslint-config) - ESLint configuration for SafeSpace projects.

- [@repo/typescript-config](https://github.com/hellskater/safespace/tree/main/packages/typescript-config) - TypeScript configuration for SafeSpace projects.

- [@repo/ui](https://github.com/hellskater/safespace/tree/main/packages/ui) - UI components for SafeSpace projects.

## Roadmap

- [ ] Publishing for multiple browser extensions
- [ ] Offline first using indexedDB
- [ ] Auto rotate keys
- [ ] Closer integration of extension and webapp
- [ ] SDKs in multiple languages
- [ ] Support for folders in notes
- [ ] Note sharing with password protection
- [ ] More tools in the ecosystem like password manager, etc
