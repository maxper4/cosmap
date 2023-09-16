declare global {
    namespace NodeJS {
        interface ProcessEnv {
            RPC_URL: string
            FAUCET_URL: string
            REST_URL: string
        }
    }
}

export {}