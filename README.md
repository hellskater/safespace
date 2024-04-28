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

<!-- https://pangea.cloud/services/domain-intel/reputation/ -->
<!-- https://pangea.cloud/services/url-intel/ -->
<!-- https://pangea.cloud/services/user-intel/ -->

- [Domain Intel](https://pangea.cloud/services/domain-intel/reputation/) - Used to check the reputation of the website.
- [URL Intel](https://pangea.cloud/services/url-intel/) - Used to check the authenticity of the link.
- [User Intel](https://pangea.cloud/services/user-intel/) - Used to check if the password has been breached.

## SafeSpace Webapp