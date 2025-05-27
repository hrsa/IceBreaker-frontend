export const en = {
  common: {
    welcome: "Welcome to",
    archive: "Archive",
    love: "Favorites",
    ban: "Ban",
    back: "Back",
    no_cards: "No cards left!",
    start_game: "Start the game",
    error: "Error",
    success: "Success",
    copy_success: "Copied to clipboard!",
  },
  profile: {
    title: "Profiles",
    select: "Select or create a profile",
    no_profile: "No profiles yet. Create your first profile!",
    create: "New profile",
    delete: "Drag here to delete",
    modal: {
      title: "Create new profile",
      placeholder: "Enter profile name",
      creating: "Creating ...",
      create: "Create",
      cancel: "Cancel",
    },
    errors: {
      empty_name: "Profile name cannot be empty",
      creation_failed: "Failed to create profile",
      delete_failed: "Failed to delete profile",
    },
  },
  category: {
    title: "Categories",
  },
  game: {
    no_more_cards: "You've gone through all available cards!",
    change_filters: "Try changing your filters to include archived or favourite cards - or come back later for more.",
  },
  login: {
    subtitle: "Sign in to your account",
    email: "Email",
    email_placeholder: "Enter your email",
    password: "Password",
    password_placeholder: "Enter your password",
    login: "Sign in",
    no_account: "Don't have an account?",
    register: "Sign up",
    fill_all_fields: "Please fill in all fields",
    legal: {
      by_logging_in: "By using IceMelter, you agree to our",
      privacy_policy: "Privacy Policy",
      and: " and",
      tos: "Terms of Service",
    },
  },
  password_reset: {
    title: "Password reset",
    subtitle: "Enter your email address to reset your password",
    button: "Request password reset",
    alerts: {
      fill_email: "Please enter your email",
      check_email: "Check your email for the password reset link",
    },
  },
  password_change: {
    title: "Change password",
    subtitle: "Please enter your new password",
    new_password: "New password",
    new_password_placeholder: "Enter your new password",
    confirm_password: "Confirm password",
    confirm_password_placeholder: "Confirm your new password",
    change_button: "Change password",
    back_to_login: "Return to login",
    errors: {
      fill_all_fields: "Please fill in all fields",
      password_mismatch: "The passwords do not match",
      password_too_short: "The password must be at least 6 characters long",
      missing_token: "Token is missing",
      change_failed: "Password change failed",
    },
    success: {
      message: "Your password has been changed.",
    },
  },
  register: {
    title: "Create an account",
    name: "Name",
    name_placeholder: "Enter your name",
    confirm_password: "Confirm password",
    confirm_password_placeholder: "Confirm your password",
    already_have_account: "Already have an account?",
    errors: {
      fill_all_fields: "Please fill in all fields",
      password_mismatch: "Passwords do not match",
      password_too_short: "Password must be at least 6 characters long",
    },
  },
  my_profile: {
    title: "My profile",
    update_button: "Update profile",
    connect_tg: "Connect my Telegram account",
    profile_updated: "Your profile has been updated.",
    modal: {
      title: "Connect Telegram",
      did_you_know: "Did you know that you can use IceMelter in different ways? We have a website, an app and a Telegram bot.",
      click_the_field: "Please click below to copy your secret phrase.",
      bot_link: "And then - send it to IceMelter Bot",
    },
    delete_modal: {
      title: "Delete my account",
      message: "Are you sure you want to delete your IceMelter account? This action cannot be undone.",
      hint: 'Please enter your email one last time and press "Delete"',
      confirm: "Delete",
    },
    errors: {
      wrong_email: "This is not your email",
    },
  },
  index: {
    logout: "Logout",
    start: "Start",
    my_profile: "My profile",
  },
  language: {
    select: "Select language",
    en: "English",
    fr: "French",
    ru: "Russian",
    it: "Italian",
  },
  tos: {
    title: "Terms of Service",
    effectiveDate: "Effective date: {{date}}",
    sections: {
      acceptanceOfTerms: {
        title: "Acceptance of Terms",
        content:
          'By accessing or using the IceMelter mobile application (the "App"), you agree to be bound by these Terms of Use. If you do not agree to these Terms, please do not use the App.',
      },
      descriptionOfService: {
        title: "Description of Service",
        content:
          "IceMelter is a mobile application that provides conversation starters, icebreaker questions, and interactive games to facilitate better communication between people.",
      },
      accountRegistration: {
        title: "Account Registration and Requirements",
        subsections: {
          accountCreation: {
            title: "Account Creation",
            content:
              "To use the App, you must create an account by providing your email address and name. You may optionally provide a Telegram ID.",
          },
          ageRequirement: {
            title: "Age Requirement",
            content:
              "You must be at least 18 years old to use the App. By creating an account, you represent and warrant that you are at least 18 years of age.",
          },
          accountSecurity: {
            title: "Account Security",
            content:
              "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.",
          },
        },
      },
      userConduct: {
        title: "User Conduct",
        subsections: {
          generalConduct: {
            title: "General Conduct",
            content:
              "You agree to use the App in compliance with all applicable laws and regulations and in accordance with these Terms. You shall not use the App in any way that could harm, disable, overburden, or impair the App or interfere with any other party's use of the App.",
          },
          userContributions: {
            title: "User Contributions",
            content:
              "You may suggest new questions or conversation starters for inclusion in the App. By submitting such suggestions, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such suggestions throughout the world in any media.",
          },
          prohibitedActivities: {
            title: "Prohibited Activities",
            content: [
              "Use the App for any illegal purpose",
              "Submit suggestions that are unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable",
              "Attempt to gain unauthorized access to the App or its related systems",
              "Interfere with or disrupt the integrity or performance of the App",
            ],
          },
        },
      },
      gameRules: {
        title: "Game Rules",
        subsections: {
          generalGameRules: {
            title: "General Game Rules",
            content:
              "The App offers various games including conversation starters and Truth or Dare. All games are designed for adult users and should be played responsibly and with mutual consent among all participants.",
          },
          truthOrDareRules: {
            title: "Truth or Dare - Game Rules",
            subsections: {
              principles: {
                title: "Consent is Mandatory",
                content: [
                  "Enthusiastic, ongoing consent is required for all game activities",
                  'Any player has the absolute right to say "pass" or "no" to any truth or dare',
                  "All players must respect others' decisions without question, pressure, or judgment",
                ],
              },
              beforePlaying: {
                title: "Before Playing",
                content: [
                  "Ensure all participants understand the adult nature of the game",
                  "Consider discussing general boundaries before starting",
                  "Create a comfortable, safe environment for all players",
                ],
              },
              gameplayGuidelines: {
                title: "Gameplay Guidelines",
                content: [
                  'Players take turns responding to randomly generated "TRUTH" or "DARE" cards',
                  'Players may "pass" on a truth or dare they are uncomfortable with (limits can be established by the group)',
                  "If a dare involves another player, that player also has the right to consent or decline",
                  "Respect all participants - no heckling, pressuring, or shaming",
                  "Maintain a positive, supportive atmosphere during play",
                  "No recording of gameplay unless all participants explicitly consent",
                  "If alcohol is involved, all players should drink responsibly",
                ],
              },
              purpose: {
                title: "Purpose of the Game",
                content:
                  "The purpose of the game is to create a fun, respectful experience for all participants. Safety, consent, and enjoyment are the priorities.",
              },
            },
          },
          responsibilityForGameUse: {
            title: "Responsibility for Game Use",
            content: [
              "Use the games in a manner that respects the dignity and autonomy of all participants",
              "Ensure all participants are adults who have consented to play",
              "Take full responsibility for the manner in which you use our game content in real-world settings",
            ],
          },
        },
      },
      intellectualPropertyRights: {
        title: "Intellectual Property Rights",
        subsections: {
          ownership: {
            title: "Ownership",
            content:
              "The App, including all of its content, features, and functionality, is owned by us and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or in any way exploit any of the content, in whole or in part, without our written consent.",
          },
          licenseToUse: {
            title: "License to Use",
            content:
              "We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for your personal, non-commercial use, subject to these Terms.",
          },
        },
      },
      termination: {
        title: "Termination",
        subsections: {
          terminationByYou: {
            title: "Termination by You",
            content: 'You may terminate your account at any time by using the "Delete my account" option in the App\'s settings.',
          },
          terminationByUs: {
            title: "Termination by Us",
            content:
              "We reserve the right to suspend or terminate your access to the App at any time for any reason, including, without limitation, if we believe that you have violated these Terms.",
          },
        },
      },
      disclaimers: {
        title: "Disclaimers",
        subsections: {
          noWarranty: {
            title: "No Warranty",
            content:
              'THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
          },
          limitationOfLiability: {
            title: "Limitation of Liability",
            content:
              "TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE APP.",
          },
          gameContentDisclaimer: {
            title: "Game Content Disclaimer",
            content:
              "The content of our games, including Truth or Dare, is intended for entertainment purposes only. We are not responsible for any actions taken by users or any consequences that may arise from the use of our game content in real-world settings. Users are solely responsible for ensuring that all gameplay is conducted in a safe, consensual, and legal manner.",
          },
        },
      },
      donations: {
        title: "Donations",
        content:
          "The App offers the option to make donations through Ko-Fi. These donations are voluntary and do not affect the core functionality of the App. Donors may receive access to exclusive features as a token of appreciation.",
      },
      modificationsToTerms: {
        title: "Modifications to the Terms",
        content:
          "We reserve the right to modify these Terms at any time. We will notify you of any changes by sending you an email or Telegram message (depending on your contact information). Your continued use of the App after the effective date of the revised Terms constitutes your acceptance of the changes.",
      },
      governingLaw: {
        title: "Governing Law",
        content:
          "These Terms shall be governed by and construed in accordance with the laws of France, without regard to its conflict of law principles.",
      },
      contactInformation: {
        title: "Contact Information",
        content: "If you have any questions about these Terms, please contact us at anton@anton.eco.",
      },
    },
  },
  privacyPolicy: {
    title: "Privacy Policy",
    effectiveDate: "Effective Date: {{date}}",
    sections: {
      introduction: {
        title: "Introduction",
        content:
          'Welcome to IceMelter ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application IceMelter (the "App").\n\nPlease read this Privacy Policy carefully. By accessing or using the App, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.',
      },
      informationWeCollect: {
        title: "Information We Collect",
        subsections: {
          personalInformation: {
            title: "Personal Information",
            content: [
              "Account Information: Email address and name for authentication purposes",
              "Optional Information: Telegram ID (if provided)",
              "User Preferences: Your interactions with conversation cards (loved or archived)",
              "User Suggestions: New conversation starters or questions you suggest for the App",
            ],
          },
          informationCollectedAutomatically: {
            title: "Information Collected Automatically",
            content:
              "We do not collect analytics data beyond what is necessary for the functionality of the App. We use Firebase only for mobile notifications and do not use it or any other third-party service for analytics purposes.",
          },
        },
      },
      howWeUseYourInformation: {
        title: "How We Use Your Information",
        content: [
          "Create and maintain your account",
          "Provide you with new conversation starters based on your preferences",
          "Process and moderate user-suggested questions",
          "Identify Ko-Fi donations and provide access to any special features for donors",
          "Send important updates about the App, including changes to our policies",
          "Improve and enhance the App's functionality",
        ],
      },
      dataStorageAndSecurity: {
        title: "Data Storage and Security",
        content:
          "All user data is stored on our application server. We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.",
      },
      dataRetention: {
        title: "Data Retention",
        content:
          "We retain your personal information for as long as your account remains active or as needed to provide you with our services. You may request the deletion of your account at any time through the App's settings.",
      },
      sharingYourInformation: {
        title: "Sharing Your Information",
        content:
          "We do not share your personal information with third parties. Your information is only used for the purposes described in this Privacy Policy.",
      },
      yourRights: {
        title: "Your Rights",
        content: [
          "Access the personal information we have about you",
          "Request correction of inaccurate personal information",
          "Request deletion of your personal information by deleting your account",
          "Object to certain types of processing of your personal information",
        ],
        contactInfo:
          "To exercise these rights, please use the account deletion option in the App's settings or contact us at anton@anton.eco.",
      },
      childrensPrivacy: {
        title: "Children's Privacy",
        content:
          "The App is intended for adults only. We do not knowingly collect personal information from individuals under the age of 18. If you are under 18, please do not use the App or provide any personal information.",
      },
      changesToPrivacyPolicy: {
        title: "Changes to This Privacy Policy",
        content:
          "We may update this Privacy Policy from time to time. We will notify you of any changes by sending you an email or Telegram message (depending on your contact information). The updated Privacy Policy will be effective when posted, and your continued use of the App after the effective date constitutes your acceptance of the updated terms.",
      },
      contactUs: {
        title: "Contact Us",
        content: "If you have any questions or concerns about this Privacy Policy, please contact us at anton@anton.eco.",
      },
    },
  },
};
