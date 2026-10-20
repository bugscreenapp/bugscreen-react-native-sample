# BugScreen — React Native / Expo integration example

The React Native twin of the [iOS sample](https://github.com/bugscreenapp/bugscreen-ios-sample) and
[Android sample](https://github.com/bugscreenapp/bugscreen-android-sample). It is the same **BugScreen
Travel** app: eight destinations, three itineraries, Explore / Saved / Trips / Profile tabs,
in-memory favourites seeded to Amalfi + Banff, a welcome dialog, procedural gradient imagery,
and the same teal/coral light and dark palette. All travel content is bundled; no backend or login
is needed to browse.

This is a standalone consumer of **`@bugscreen/react-native` 1.8.0 from npm**, which pins the
published native iOS and Android SDKs to 1.8.0. There are no workspace links or local SDK overrides.
The app uses Expo SDK 57, React Native 0.86, TypeScript, and Expo Router.

Expo 57 is intentional: the published BugScreen 1.8.0 Android bridge uses a React Native API that
changed in RN 0.88 / Expo 58. Using Expo 58 currently fails native compilation. This sample consumes
the unmodified published SDK; upgrade Expo after a compatible BugScreen patch is released.

## Run it

Use a supported Node.js version (22.13+ on the 22.x line, or a supported newer even release).
The `.nvmrc` selects Node 22.

```bash
npm ci
cp -f .env.example .env.local
# For reporting, set EXPO_PUBLIC_BUGSCREEN_API_KEY=fb_your_api_key_here in .env.local
npm run ios
# or, with an Android emulator running:
npm run android
```

These commands generate native projects and create a **development build**. Local iOS builds need
macOS, Xcode 26.4+ and CocoaPods; Android builds need an Android SDK and JDK 17. Expo SDK 57 supports
iOS 16.4+ and Android 7+ (API 24), and compiles against Android API 36. Use `JAVA_HOME` to select
JDK 17 when your default Java is newer.

**Expo Go cannot run BugScreen's native SDK.** Use the development build above. After that first
build, `npm start` starts Metro for the installed development client. Rebuild after changing native
dependencies or config plugins. You do not need to rebuild for ordinary TypeScript screen changes.

A blank API key is supported for building and browsing the Travel app. Reporting requires a valid
app key from the [BugScreen console](https://bugscreen.app) to load report settings and submit. A
blank or invalid key opens the reporter with a settings-loading error. `.env.local` is git-ignored.
`EXPO_PUBLIC_` values are embedded in the client bundle: use a BugScreen app key here, never a
server credential. After changing it, restart Metro with `npm start -- --clear` and reload the app.

On first launch, dismiss the welcome dialog, then allow screenshot access if asked. Take a
screenshot anywhere in the app to open BugScreen automatically. **Profile → Report a problem**
and **Send feedback** open the same native reporter manually. Declining screenshot access leaves
manual reporting available; the camera tip in Profile lets you check/request access again.

### Cloud development builds

If you prefer EAS, `eas.json` includes a `development` profile:

```bash
npx eas-cli@latest build --profile development --platform android
# or --platform ios (requires Apple signing credentials for a device build)
```

EAS will prompt you to sign in and link your Expo project. Configure the API key in the build's
Expo environment for reporting; your git-ignored `.env.local` is not committed to GitHub.
No signing credentials or Expo project IDs are bundled in this repository.

## The integration

| What                                  | Where                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| Install the published SDK             | `package.json` → `@bugscreen/react-native: 1.8.0`                                          |
| Add the native config plugin          | `app.json` → `@bugscreen/react-native` with the Photos usage description                   |
| Configure once at startup             | `src/app/_layout.tsx` → `startBugScreen()`                                                 |
| Attach user/session context           | `src/bugscreen/bugscreen.ts` → `setCustomData` (`userId`, `plan`, `homeCity`, `sessionId`) |
| Request screenshot access when needed | Welcome dismissal → `shouldRequestPermission()` / `requestScreenshotPermission()`          |
| Record breadcrumbs                    | Screen focus, destination/trip opens, and save actions → `breadcrumbs`                     |
| Manual report entry point             | `src/app/(tabs)/profile.tsx` → `presentReport()`                                           |

Every SDK call lives behind `src/bugscreen/bugscreen.ts`. Configuration runs once before the screens
mount. Screens use the same breadcrumb names as the native samples. Permission failures and SDK
configuration errors leave the travel app usable.

Reporting is enabled in development, Release and preview builds so installed review builds can
exercise screenshot detection, manual reports, breadcrumbs and custom data. SDK debug logging is
enabled only when React Native's `__DEV__` flag is true.

For a standalone iPhone review build, set the app key before building, then run:

```bash
npm run ios -- --configuration Release --device
```

The Release build bundles JavaScript and the app key at build time and runs without Metro. Changing
`.env.local` afterwards requires rebuilding and reinstalling the app. The app still needs network
access to load reporter settings and submit reports.

The plugin writes `NSPhotoLibraryUsageDescription` on iOS. Android permissions come from the native
SDK's merged manifest. Neither platform needs hand-edited generated files. The `ios/` and `android/`
directories are generated by Expo and git-ignored.

## Project layout

```text
src/
  app/
    _layout.tsx              # SDK startup, welcome, screenshot permission
    (tabs)/                  # Explore, Saved, Trips, Profile
    destination/[id].tsx     # Destination detail + save control
    trip/[id].tsx            # Trip itinerary
  bugscreen/bugscreen.ts     # The only SDK integration surface
  components/TravelUI.tsx    # Cards, gradients, shared screen building blocks
  data/travel.ts             # Same static destinations, itineraries, and user
  state/TravelProvider.tsx   # In-memory favourites shared by every screen
  theme.ts                   # System light/dark palette
  __tests__/                 # Saved flows and SDK integration tests
```

Saved destinations reset when the app restarts. Settings rows are illustrative, as in the native
samples. No external photos, network data, tracking services, or account backend are used by the
travel UI. SDK configuration and report submission can use the network.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run export       # Production Metro bundles for iOS + Android
npx expo-doctor
```

The GitHub Actions check runs lint, TypeScript, tests, and both platform exports. Native compilation
is checked locally with development builds; Metro export does not compile the native SDK. The
prebuilds can also be inspected with `npx expo prebuild --no-install`.
