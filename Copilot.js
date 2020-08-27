import {
  NativeModules,
  DeviceEventEmitter,
  requireNativeComponent,
} from 'react-native'

const {
  CopilotStartupMgr,
  CopilotMgr,
  RouteMgr,
  AddStopPurpose,
  GeocodeSearchType,
  StopBuilder,
  RoutePreviewMode,
  GeocodeType,
  LicenseListener,
  LicenseMgr,
  MapDataMgr,
  MapRegion,
  MapDownloadResponse,
} = NativeModules

export const init = () => CopilotStartupMgr.bindCoPilotService()
export const destroy = () => CopilotStartupMgr.unbindCopilotService()

export const isActive = () => CopilotMgr.isActive()

const configure = () => {
  try {
    CopilotMgr.setConfigurationSetting({
      name: 'PreventDataDownload',
      value: 0,
    })
  } catch (error) {
    console.error('Copilot: Failed to set configuration.', error)
  }
}

const isLicensingReady = () => LicenseMgr.isLicensingReady()

export const setupEventListeners = ({ setInitialised }) => ({
  startupListener: DeviceEventEmitter.addListener(
    'onCPStartup',
    async () => {
      console.log('onCPStartup')
      configure({ PreventDataDownload: 0 })
      if (await isLicensingReady()) {
        // Delay setting directions until Copilot fully inits license.
        // Navigate to copilot when the app is killed and restarted.
        setTimeout(() => setInitialised(true), 3000)
      }
    },
  ),
  licenseReadyListener: DeviceEventEmitter.addListener(
    'onLicensingReady',
    () => {
      console.log('onLicensingReady')
    },
  ),
  licenseLogin: DeviceEventEmitter.addListener('onLicenseMgtLogin', () => {
    console.log('onLicenseMgtLogin')
  }),
})

export const configureLogin = (username, companyId) =>
  LicenseListener.setAMSLoginInfo(username, companyId)

export const CopilotView = requireNativeComponent('CopilotView', null)
