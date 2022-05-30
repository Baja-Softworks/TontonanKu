const path = require('path');
const { Menu } = require('electron');
const { aboutMenuItem } = require('electron-util');
// const mainWindow = require('electron-main-window').getMainWindow();


const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin' ? true : false


// Custom Menu Build
const menu = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      role: 'fileMenu',
      submenu: [
        {role: 'copy' },
        {role: 'cut' },
        {role: 'paste' },
        {
          type: 'separator'
        },
        {role: 'quit' }
      ]
    },
    {
      role: 'viewMenu',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'togglefullscreen' },
        { role: 'toggledevtools',
          visible: false
        },
        {
          label: "Exit full screen",
          visible: false,
          accelerator: "Esc",
          click(item, focusedWindow) {
              if (focusedWindow.isFullScreen()) {
                  focusedWindow.setFullScreen(false);
              }
          },
      } 
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Help',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/Baja-Softworks/TontonanKu')
          }
        },
        aboutMenuItem({
          icon: path.join(__dirname, './src/img/favicon-32x32.png'),
          copyright: 'Created by Iqbal Anggoro | Published by Baja Softworks',
          text: `Electron: ${process.versions.electron} 
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}` 
        }),
        {
           type: 'separator'
        },
        // {
        //   label: 'Baja Softworks [Website]',
        //   click: async () => {
        //     const { shell } = require('electron')
        //     await shell.openExternal('https://baja-softworks.github.io/')
        //   }
        // },
      ],
    },
    ...(isDev
      ? [
          {
            label: 'Developer',
            submenu: [
              { role: 'reload' },
              { role: 'forcereload' },
              { type: 'separator' },
              { role: 'toggledevtools' },
            ],
          },
        ]
      : []),
  ]

module.exports = Menu.buildFromTemplate(menu);