#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

export JAVA_HOME="/snap/android-studio/current/jbr" # /bin/java
export PATH="$JAVA_HOME/bin:$PATH"

# ── Prerequisites ──────────────────────────────────────────────
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found"; exit 1; }
command -v java  >/dev/null 2>&1 || { echo "ERROR: java not found"; exit 1; }

if [ -z "${ANDROID_HOME:-}" ] && [ ! -f "$ROOT_DIR/android/local.properties" ]; then
    echo "ERROR: ANDROID_HOME not set and android/local.properties missing."
    echo "       Point one of them to your Android SDK."
    exit 1
fi

cd "$ROOT_DIR"

# ── 1. Build Angular (production) ──────────────────────────────
echo "==> Building Angular app (production)..."
npm run build

# ── 2. Add Android platform if missing ─────────────────────────
if [ ! -d android ]; then
    echo "==> Adding Android platform..."
    npx cap add android
fi

# ── 3. Sync Capacitor (copies www + config to android/) ────────
echo "==> Syncing Capacitor..."
npx cap sync android

# ── 4. Build debug APK ─────────────────────────────────────────
echo "==> Building debug APK..."
cd android && ./gradlew assembleDebug

# ── Done ───────────────────────────────────────────────────────
APK_PATH="app/build/outputs/apk/debug"
echo ""
echo "Build complete!"
echo "APK: $ROOT_DIR/android/$APK_PATH/app-debug.apk"
