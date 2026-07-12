import { contextBridge, ipcRenderer, webUtils } from 'electron'

contextBridge.exposeInMainWorld('zentarDesktop', {
  getConnection: profile => ipcRenderer.invoke('zentar:connection', profile),
  revalidateConnection: () => ipcRenderer.invoke('zentar:connection:revalidate'),
  touchBackend: profile => ipcRenderer.invoke('zentar:backend:touch', profile),
  getGatewayWsUrl: profile => ipcRenderer.invoke('zentar:gateway:ws-url', profile),
  openSessionWindow: (sessionId, opts) => ipcRenderer.invoke('zentar:window:openSession', sessionId, opts),
  openNewSessionWindow: () => ipcRenderer.invoke('zentar:window:openNewSession'),
  petOverlay: {
    // Main renderer → main process: window lifecycle + drag. `request` is
    // `{ bounds, screen }`; resolves with the screen bounds it actually used.
    open: request => ipcRenderer.invoke('zentar:pet-overlay:open', request),
    close: () => ipcRenderer.invoke('zentar:pet-overlay:close'),
    setBounds: bounds => ipcRenderer.send('zentar:pet-overlay:set-bounds', bounds),
    setIgnoreMouse: ignore => ipcRenderer.send('zentar:pet-overlay:ignore-mouse', ignore),
    // Flip the overlay focusable (and focus it) while the composer needs keys.
    setFocusable: focusable => ipcRenderer.send('zentar:pet-overlay:set-focusable', focusable),
    // Main renderer → overlay (forwarded by main): push the latest pet state.
    pushState: payload => ipcRenderer.send('zentar:pet-overlay:state', payload),
    // Overlay → main renderer (forwarded by main): pop back in / composer submit.
    control: payload => ipcRenderer.send('zentar:pet-overlay:control', payload),
    // Overlay subscribes to state pushes.
    onState: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('zentar:pet-overlay:state', listener)

      return () => ipcRenderer.removeListener('zentar:pet-overlay:state', listener)
    },
    // Main renderer subscribes to overlay control messages.
    onControl: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('zentar:pet-overlay:control', listener)

      return () => ipcRenderer.removeListener('zentar:pet-overlay:control', listener)
    }
  },
  getBootProgress: () => ipcRenderer.invoke('zentar:boot-progress:get'),
  getConnectionConfig: profile => ipcRenderer.invoke('zentar:connection-config:get', profile),
  saveConnectionConfig: payload => ipcRenderer.invoke('zentar:connection-config:save', payload),
  applyConnectionConfig: payload => ipcRenderer.invoke('zentar:connection-config:apply', payload),
  testConnectionConfig: payload => ipcRenderer.invoke('zentar:connection-config:test', payload),
  probeConnectionConfig: remoteUrl => ipcRenderer.invoke('zentar:connection-config:probe', remoteUrl),
  oauthLoginConnectionConfig: remoteUrl => ipcRenderer.invoke('zentar:connection-config:oauth-login', remoteUrl),
  oauthLogoutConnectionConfig: remoteUrl => ipcRenderer.invoke('zentar:connection-config:oauth-logout', remoteUrl),
  profile: {
    get: () => ipcRenderer.invoke('zentar:profile:get'),
    set: name => ipcRenderer.invoke('zentar:profile:set', name)
  },
  api: request => ipcRenderer.invoke('zentar:api', request),
  notify: payload => ipcRenderer.invoke('zentar:notify', payload),
  requestMicrophoneAccess: () => ipcRenderer.invoke('zentar:requestMicrophoneAccess'),
  readFileDataUrl: filePath => ipcRenderer.invoke('zentar:readFileDataUrl', filePath),
  readFileText: filePath => ipcRenderer.invoke('zentar:readFileText', filePath),
  selectPaths: options => ipcRenderer.invoke('zentar:selectPaths', options),
  writeClipboard: text => ipcRenderer.invoke('zentar:writeClipboard', text),
  saveImageFromUrl: url => ipcRenderer.invoke('zentar:saveImageFromUrl', url),
  saveImageBuffer: (data, ext) => ipcRenderer.invoke('zentar:saveImageBuffer', { data, ext }),
  saveClipboardImage: () => ipcRenderer.invoke('zentar:saveClipboardImage'),
  getPathForFile: file => {
    try {
      return webUtils.getPathForFile(file) || ''
    } catch {
      return ''
    }
  },
  normalizePreviewTarget: (target, baseDir) => ipcRenderer.invoke('zentar:normalizePreviewTarget', target, baseDir),
  watchPreviewFile: url => ipcRenderer.invoke('zentar:watchPreviewFile', url),
  stopPreviewFileWatch: id => ipcRenderer.invoke('zentar:stopPreviewFileWatch', id),
  setTitleBarTheme: payload => ipcRenderer.send('zentar:titlebar-theme', payload),
  setNativeTheme: mode => ipcRenderer.send('zentar:native-theme', mode),
  setTranslucency: payload => ipcRenderer.send('zentar:translucency', payload),
  setPreviewShortcutActive: active => ipcRenderer.send('zentar:previewShortcutActive', Boolean(active)),
  openExternal: url => ipcRenderer.invoke('zentar:openExternal', url),
  openPreviewInBrowser: url => ipcRenderer.invoke('zentar:openPreviewInBrowser', url),
  fetchLinkTitle: url => ipcRenderer.invoke('zentar:fetchLinkTitle', url),
  sanitizeWorkspaceCwd: cwd => ipcRenderer.invoke('zentar:workspace:sanitize', cwd),
  settings: {
    getDefaultProjectDir: () => ipcRenderer.invoke('zentar:setting:defaultProjectDir:get'),
    setDefaultProjectDir: dir => ipcRenderer.invoke('zentar:setting:defaultProjectDir:set', dir),
    pickDefaultProjectDir: () => ipcRenderer.invoke('zentar:setting:defaultProjectDir:pick')
  },
  zoom: {
    // Current zoom of this window, as { level, percent }.
    get: () => ipcRenderer.invoke('zentar:zoom:get'),
    setPercent: percent => ipcRenderer.send('zentar:zoom:set-percent', percent),
    // Fires on every zoom change, including the Ctrl/Cmd +/-/0 shortcuts,
    // so the settings UI can stay in sync with the keyboard.
    onChanged: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('zentar:zoom:changed', listener)

      return () => ipcRenderer.removeListener('zentar:zoom:changed', listener)
    }
  },
  revealLogs: () => ipcRenderer.invoke('zentar:logs:reveal'),
  getRecentLogs: () => ipcRenderer.invoke('zentar:logs:recent'),
  readDir: dirPath => ipcRenderer.invoke('zentar:fs:readDir', dirPath),
  gitRoot: startPath => ipcRenderer.invoke('zentar:fs:gitRoot', startPath),
  revealPath: targetPath => ipcRenderer.invoke('zentar:fs:reveal', targetPath),
  renamePath: (targetPath, newName) => ipcRenderer.invoke('zentar:fs:rename', targetPath, newName),
  writeTextFile: (filePath, content) => ipcRenderer.invoke('zentar:fs:writeText', filePath, content),
  trashPath: targetPath => ipcRenderer.invoke('zentar:fs:trash', targetPath),
  git: {
    worktreeList: repoPath => ipcRenderer.invoke('zentar:git:worktreeList', repoPath),
    worktreeAdd: (repoPath, options) => ipcRenderer.invoke('zentar:git:worktreeAdd', repoPath, options),
    worktreeRemove: (repoPath, worktreePath, options) =>
      ipcRenderer.invoke('zentar:git:worktreeRemove', repoPath, worktreePath, options),
    branchSwitch: (repoPath, branch) => ipcRenderer.invoke('zentar:git:branchSwitch', repoPath, branch),
    branchList: repoPath => ipcRenderer.invoke('zentar:git:branchList', repoPath),
    repoStatus: repoPath => ipcRenderer.invoke('zentar:git:repoStatus', repoPath),
    fileDiff: (repoPath, filePath) => ipcRenderer.invoke('zentar:git:fileDiff', repoPath, filePath),
    scanRepos: (roots, options) => ipcRenderer.invoke('zentar:git:scanRepos', roots, options),
    review: {
      list: (repoPath, scope, baseRef) => ipcRenderer.invoke('zentar:git:review:list', repoPath, scope, baseRef),
      diff: (repoPath, filePath, scope, baseRef, staged) =>
        ipcRenderer.invoke('zentar:git:review:diff', repoPath, filePath, scope, baseRef, staged),
      stage: (repoPath, filePath) => ipcRenderer.invoke('zentar:git:review:stage', repoPath, filePath),
      unstage: (repoPath, filePath) => ipcRenderer.invoke('zentar:git:review:unstage', repoPath, filePath),
      revert: (repoPath, filePath) => ipcRenderer.invoke('zentar:git:review:revert', repoPath, filePath),
      revParse: (repoPath, ref) => ipcRenderer.invoke('zentar:git:review:revParse', repoPath, ref),
      commit: (repoPath, message, push) => ipcRenderer.invoke('zentar:git:review:commit', repoPath, message, push),
      commitContext: repoPath => ipcRenderer.invoke('zentar:git:review:commitContext', repoPath),
      push: repoPath => ipcRenderer.invoke('zentar:git:review:push', repoPath),
      shipInfo: repoPath => ipcRenderer.invoke('zentar:git:review:shipInfo', repoPath),
      createPr: repoPath => ipcRenderer.invoke('zentar:git:review:createPr', repoPath)
    }
  },
  terminal: {
    dispose: id => ipcRenderer.invoke('zentar:terminal:dispose', id),
    resize: (id, size) => ipcRenderer.invoke('zentar:terminal:resize', id, size),
    start: options => ipcRenderer.invoke('zentar:terminal:start', options),
    write: (id, data) => ipcRenderer.invoke('zentar:terminal:write', id, data),
    onData: (id, callback) => {
      const channel = `zentar:terminal:${id}:data`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    },
    onExit: (id, callback) => {
      const channel = `zentar:terminal:${id}:exit`
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on(channel, listener)

      return () => ipcRenderer.removeListener(channel, listener)
    }
  },
  onClosePreviewRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('zentar:close-preview-requested', listener)

    return () => ipcRenderer.removeListener('zentar:close-preview-requested', listener)
  },
  onOpenUpdatesRequested: callback => {
    const listener = () => callback()
    ipcRenderer.on('zentar:open-updates', listener)

    return () => ipcRenderer.removeListener('zentar:open-updates', listener)
  },
  onDeepLink: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:deep-link', listener)

    return () => ipcRenderer.removeListener('zentar:deep-link', listener)
  },
  signalDeepLinkReady: () => ipcRenderer.invoke('zentar:deep-link-ready'),
  onWindowStateChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:window-state-changed', listener)

    return () => ipcRenderer.removeListener('zentar:window-state-changed', listener)
  },
  onFocusSession: callback => {
    const listener = (_event, sessionId) => callback(sessionId)
    ipcRenderer.on('zentar:focus-session', listener)

    return () => ipcRenderer.removeListener('zentar:focus-session', listener)
  },
  onNotificationAction: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:notification-action', listener)

    return () => ipcRenderer.removeListener('zentar:notification-action', listener)
  },
  onPreviewFileChanged: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:preview-file-changed', listener)

    return () => ipcRenderer.removeListener('zentar:preview-file-changed', listener)
  },
  onBackendExit: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:backend-exit', listener)

    return () => ipcRenderer.removeListener('zentar:backend-exit', listener)
  },
  onPowerResume: callback => {
    const listener = () => callback()
    ipcRenderer.on('zentar:power-resume', listener)

    return () => ipcRenderer.removeListener('zentar:power-resume', listener)
  },
  onBootProgress: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:boot-progress', listener)

    return () => ipcRenderer.removeListener('zentar:boot-progress', listener)
  },
  // First-launch bootstrap progress -- emitted by the install.ps1 stage
  // runner in main.ts (apps/desktop/electron/bootstrap-runner.ts).
  // Renderer's install overlay subscribes to live events and queries the
  // current snapshot via getBootstrapState() to recover after a devtools
  // reload mid-bootstrap.
  getBootstrapState: () => ipcRenderer.invoke('zentar:bootstrap:get'),
  resetBootstrap: () => ipcRenderer.invoke('zentar:bootstrap:reset'),
  repairBootstrap: () => ipcRenderer.invoke('zentar:bootstrap:repair'),
  cancelBootstrap: () => ipcRenderer.invoke('zentar:bootstrap:cancel'),
  onBootstrapEvent: callback => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('zentar:bootstrap:event', listener)

    return () => ipcRenderer.removeListener('zentar:bootstrap:event', listener)
  },
  getVersion: () => ipcRenderer.invoke('zentar:version'),
  getRemoteDisplayReason: () => ipcRenderer.invoke('zentar:get-remote-display-reason'),
  uninstall: {
    summary: () => ipcRenderer.invoke('zentar:uninstall:summary'),
    run: mode => ipcRenderer.invoke('zentar:uninstall:run', { mode })
  },
  updates: {
    check: () => ipcRenderer.invoke('zentar:updates:check'),
    apply: opts => ipcRenderer.invoke('zentar:updates:apply', opts),
    getBranch: () => ipcRenderer.invoke('zentar:updates:branch:get'),
    setBranch: name => ipcRenderer.invoke('zentar:updates:branch:set', name),
    onProgress: callback => {
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('zentar:updates:progress', listener)

      return () => ipcRenderer.removeListener('zentar:updates:progress', listener)
    }
  },
  themes: {
    fetchMarketplace: id => ipcRenderer.invoke('zentar:vscode-theme:fetch', id),
    searchMarketplace: query => ipcRenderer.invoke('zentar:vscode-theme:search', query)
  }
})
