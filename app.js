
import {
    WalletConnectModalSign,
    useConnect,
    useRequest
  } from '@walletconnect/modal-sign-react'
  import { useState } from 'react'
  import { defineChain } from '../../utils/chain/defineChain.js'
  
  export const vechain = /*#__PURE__*/ defineChain({
    id: 100009,
    name: 'Vechain',
    network: 'vechain',
    nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.vechain.org'],
      },
      public: {
        http: ['https://mainnet.vechain.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Vechain Explorer',
        url: 'https://explore.vechain.org',
      },
      vechainStats: {
        name: 'Vechain Stats',
        url: 'https://vechainstats.com',
      },
    },
  })
  
  const projectId = 'your project id' // Replace 'your project id' with the actual project ID
  
  export default function HomePage() {
    const [session, setSession] = useState({})
    const { request, data, error, loading } = useRequest()
    const [disabled, setDisabled] = useState(false)
    const { connect } = useConnect({
      requiredNamespaces: {
        eip155: {
          methods: ['eth_sendTransaction', 'personal_sign'],
          chains: ['100009'], // Update this to the appropriate chain ID for VeChain
          events: ['chainChanged', 'accountsChanged']
        }
      }
    })
  
    async function onConnect() {
      try {
        setDisabled(true)
        const session = await connect()
        console.info(session)
        setSession(session)
      } catch (err) {
        console.error(err)
      } finally {
        setDisabled(false)
      }
    }
  
    return (
      <>
        <button onClick={onConnect} disabled={disabled}>
          Connect Wallet
        </button>
        <button
          onClick={async () => {
            const response = await request({
              topic: session?.topic,
              chainId: '100009', // Update this to the appropriate chain ID for VeChain
              request: {
                id: 1,
                jsonrpc: '2.0',
                method: 'personal_sign',
                params: [
                  {
                    // VeChain specific transaction details go here
                  }
                ]
              }
            })
            console.log(response)
          }}
          disabled={disabled}
        >
          Send Transaction
        </button>
  
        <WalletConnectModalSign
          projectId={projectId}
          metadata={{
            name: 'My Dapp',
            description: 'My Dapp description',
            url: 'https://my-dapp.com',
            icons: ['https://my-dapp.com/logo.png']
          }}
        />
      </>
    )
  }
  