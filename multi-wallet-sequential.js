const fs = require("fs");
const path = require("path");
const { SigningCosmWasmClient, CosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const { calculateFee, GasPrice } = require('@cosmjs/stargate');

console.clear();
console.log("\x1b[35m%s\x1b[0m", "============================================");
console.log("\x1b[36m%s\x1b[0m", "   OROSWAP BOT - NHIỀU VÍ TUẦN TỰ        ");
console.log("\x1b[36m%s\x1b[0m", "               VELHUST                   ");
console.log("\x1b[35m%s\x1b[0m", "============================================\n");

// Đọc mnemonic từ file phrase.txt
const loadWallet = () => {
    try {
        const mnemonic = fs.readFileSync(path.join(__dirname, "phrase.txt"), "utf8").trim();
        console.log(`📁 Đã tải ví từ file phrase.txt`);
        return mnemonic;
    } catch (error) {
        console.error("❌ Không thể đọc file phrase.txt.");
        process.exit(1);
    }
};

const CONFIG = {
    rpcEndpoint: "https://testnet-rpc.zigchain.com",
    chainId: "zig-test-2",
    zigDenom: "uzig",
    oroDenom: "coin.zig10rfjm85jmzfhravjwpq3hcdz8ngxg7lxd0drkr.uoro",
    swapContract: "zig15jqg0hmp9n06q0as7uk3x9xkwr9k3r7yh4ww2uc0hek8zlryrgmsamk4qg",
    gasPrice: GasPrice.fromString("0.025uzig"),
};

const ZIG_AMOUNT = 0.01;
const ORO_AMOUNT = 0.01;
const LIQ_ORO = "10";
const LIQ_ZIG = "4";

const delay = async (ms) => {
    for (let i = ms / 1000; i > 0; i--) {
        process.stdout.write(`\r⏳ Đang chờ ${i} giây... `);
        await new Promise(res => setTimeout(res, 1000));
    }
    process.stdout.write("\r\n");
};

async function getBalance(mnemonic, denom) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "zig" });
    const [account] = await wallet.getAccounts();
    const client = await CosmWasmClient.connect(CONFIG.rpcEndpoint);
    const balance = await client.getBalance(account.address, denom);
    return { address: account.address, amount: balance.amount, formatted: Number(balance.amount) / 1e6 };
}

async function getBeliefPrice(denom, amount) {
    const client = await CosmWasmClient.connect(CONFIG.rpcEndpoint);
    const sim = await client.queryContractSmart(CONFIG.swapContract, {
        simulation: {
            offer_asset: {
                amount,
                info: { native_token: { denom: denom } }
            }
        }
    });
    const beliefPrice = (BigInt(amount) * BigInt(1e6)) / BigInt(sim.return_amount);
    return (Number(beliefPrice) / 1e6).toFixed(18);
}

async function swap(mnemonic, amount, fromDenom, toDenom, walletIndex) {
    try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "zig" });
        const [account] = await wallet.getAccounts();
        const client = await SigningCosmWasmClient.connectWithSigner(CONFIG.rpcEndpoint, wallet, {
            gasPrice: CONFIG.gasPrice, chainId: CONFIG.chainId
        });

        const baseAmount = Math.floor(amount * 1e6).toString();
        const beliefPrice = await getBeliefPrice(fromDenom, baseAmount);
        const fee = calculateFee(320000, CONFIG.gasPrice);

        const msg = {
            swap: {
                belief_price: beliefPrice,
                max_spread: "0.005",
                offer_asset: {
                    amount: baseAmount,
                    info: { native_token: { denom: fromDenom } }
                }
            }
        };

        const result = await client.execute(account.address, CONFIG.swapContract, msg, fee, "Swap", [
            { denom: fromDenom, amount: baseAmount }
        ]);

        const fromName = fromDenom === CONFIG.zigDenom ? "ZIG" : "ORO";
        const toName = toDenom === CONFIG.zigDenom ? "ZIG" : "ORO";
        console.log(`\n[Ví ${walletIndex}] ✅ Swap ${fromName} → ${toName} thành công! TX: ${result.transactionHash}`);
        console.log(`[Ví ${walletIndex}] 🔍 https://zigscan.org/tx/${result.transactionHash}`);
    } catch (e) {
        console.error(`[Ví ${walletIndex}] ❌ Swap thất bại:`, e.message);
    }
}

async function addLiquidity(mnemonic, amountUoro, amountUzig, walletIndex) {
    try {
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "zig" });
        const [account] = await wallet.getAccounts();
        const client = await SigningCosmWasmClient.connectWithSigner(CONFIG.rpcEndpoint, wallet, {
            gasPrice: CONFIG.gasPrice, chainId: CONFIG.chainId
        });

        const msg = {
            provide_liquidity: {
                assets: [
                    {
                        amount: amountUoro,
                        info: { native_token: { denom: CONFIG.oroDenom } }
                    },
                    {
                        amount: amountUzig,
                        info: { native_token: { denom: CONFIG.zigDenom } }
                    }
                ],
                slippage_tolerance: "0.5"
            }
        };

        const funds = [
            { denom: CONFIG.oroDenom, amount: amountUoro },
            { denom: CONFIG.zigDenom, amount: amountUzig }
        ];

        const fee = calculateFee(270000, CONFIG.gasPrice);

        const result = await client.execute(account.address, CONFIG.swapContract, msg, fee, "Swap", funds);

        console.log(`\n[Ví ${walletIndex}] ✅ Cung cấp thanh khoản cặp ORO/ZIG thành công! TX: ${result.transactionHash}`);
        console.log(`[Ví ${walletIndex}] 🔍 https://zigscan.org/tx/${result.transactionHash}`);
    } catch (err) {
        console.error(`[Ví ${walletIndex}] ❌ Thêm thanh khoản thất bại:`, err.message);
    }
}

async function runBotForWallet(mnemonic, walletIndex) {
    console.log(`\n🚀 Bắt đầu chạy bot cho Ví ${walletIndex}`);
    
    // Kiểm tra balance trước khi bắt đầu
    try {
        const zigBalance = await getBalance(mnemonic, CONFIG.zigDenom);
        const oroBalance = await getBalance(mnemonic, CONFIG.oroDenom);
        console.log(`[Ví ${walletIndex}] 💰 Balance: ${zigBalance.formatted} ZIG, ${oroBalance.formatted} ORO`);
    } catch (error) {
        console.error(`[Ví ${walletIndex}] ❌ Không thể kiểm tra balance:`, error.message);
        return;
    }

    for (let liqCount = 0; liqCount < 10; liqCount++) {
        console.log(`\n[Ví ${walletIndex}] === Chu kỳ Swap thứ ${liqCount + 1} ===`);
        
        // Swap ZIG → ORO (5 lần)
        for (let i = 0; i < 5; i++) {
            await swap(mnemonic, ZIG_AMOUNT, CONFIG.zigDenom, CONFIG.oroDenom, walletIndex);
            await delay(15000);
        }

        // Swap ORO → ZIG (5 lần)
        for (let i = 0; i < 5; i++) {
            await swap(mnemonic, ORO_AMOUNT, CONFIG.oroDenom, CONFIG.zigDenom, walletIndex);
            await delay(15000);
        }

        console.log(`\n[Ví ${walletIndex}] 💧 Đang thêm thanh khoản...`);
        await addLiquidity(mnemonic, LIQ_ORO, LIQ_ZIG, walletIndex);
        await delay(15000);
    }
    
    console.log(`\n✅ Hoàn thành bot cho Ví ${walletIndex}`);
}

async function runMultiWalletBot() {
    const mnemonic = loadWallet();
    
    if (!mnemonic) {
        console.error("❌ Không có mnemonic được tìm thấy trong file phrase.txt");
        return;
    }

    console.log(`\n🎯 Bắt đầu chạy bot cho 1 ví tuần tự...`);
    
    await runBotForWallet(mnemonic, 1);
    
    console.log(`\n🎉 Hoàn thành!`);
}

runMultiWalletBot(); 