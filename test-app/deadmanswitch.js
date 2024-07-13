import {getDeadmanSwitch, getDeadmanSwitchValidatorMockSignature} from "@rhinestone/module-sdk";
import { privateKeyToAccount } from "viem/accounts";
import {pimlicoBundlerClient, publicClient, safeAccount, smartAccountClient} from "./smart-account.js";

const nominee = privateKeyToAccount("");


const module = await getDeadmanSwitch({
    nominee: nominee.address,
    timeout: "60000000",
    moduleType: "validator",
    account: safeAccount,
    client: publicClient,
});

try{
    const opHash = await smartAccountClient.installModule({
        type: module.type,
        address: module.module,
        context: module.initData,
    });
} catch (e) {
    console.log('error', e)
}