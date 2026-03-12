const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

// ---------- KONFIGURASI AKUN ----------
const accounts = [
  {
    name: "AKUN +6285771582422",
    apiId: 29077885,
    apiHash: "1ac23eeec768f729c4e8fe81c9a29d80",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjIwMAG7S25DKmlhrE+57O4lnty5nCYbex4NbGbyalQVSRyBoAz/ntc6I3zXI04NrFyfX3471XZxWjIPVx6jnJFS47L+z6AAG+IMDvXApKtOP9Xcd0Oy4Dd5ExkmOD5/6mmdRzbXPyjKItTElLuoOYuQoM3sYqedJ5SoSgMrctFsjYjh5d/uECrpKtxO/zPDxv5JstUpZ8FuEOQsLpevgTJ7fZkicFaSqBgdRxuLE8GDuqtNzGhgel92Mnn7fcOoHb0LT1KWzbGrTzNUwHWgCv6MK4hXao5uEmsaBIHNcI4ABDTYul8l9Sd70wfiZ00a91QKhX1NK48Re7Y+2pFXO1rmj1G37w=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [0, 2, 4, 6, 8],
  },
  {
    name: "AKUN +6285749156889",
    apiId: 29077885,
    apiHash: "8abae3cbda9be207308b22a01668e4e0",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjEzOQG7W2u+j+HrJpRzuHbMOfaBz3csguPn4wjghgyptQzzJDDpLVqswY4ox4Qz/QfV6aKiKkVT5vWxuXvW91hy8mF6d3Z1RhdYircfFtLIINkMET4lDBgDycjG0aNxcmPNa4lCvrCYZ05Dks6eFEgcV0AwHK91A7zMjH+tvHJ2ZvSsLfweIOWfhJDEdG5TTyjIIWXAoE9B5yDK+bb8DHkmY8P1zi2zO8+IqSnjc/lFoit3S+vDTTAMml9Qax+b0eQJvvZhHd7J6V6cbvvM7zUNsIIDP1p7orbFR7pNbi0QpcEoJGNOZGb0kHGjTTn+mrKmB+OrrPmUpDSpv8IfqLpTtuFq8w=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [10, 12, 14, 18],
  },
  {
    name: "AKUN +6283191188176",
    apiId: 20310672,
    apiHash: "d044b5a578a25f7dc1b4a2e68b967ad0",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjIwMAG7wCvdgsUMjDjVsPGUDKRkgEgh1+L3Bkj0LUqHUkYWRpLT8BvwrVPNELSY2tFOl4GSKdaUoACSzvkKeBXM9zCuVgPRPdGRP6kHnbk1qgyH2RmJq8EaA4caiDYYcHJlBr78c2j6cT44FphRHLGbmZgpZ4Sg/IySUt0Pqp+oACkrPIvPvhjHIbc5Qp7r/fZoai+u95dhXn4vgWlXZVRYZ7nEFnL2HCiQ/it0o3/tMgI64QpSWltIWSxlVq2Ehd5O4glUB5bLT+U5Rp4EJ5UrpBakXcOoRIEH8sGvrIRDwYJKkXO64P6z97HliuSgckL3FgqCN5SLclHvZwPftmFdDKL5aA=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [20, 23, 25, 28],
  },
  {
    name: "AKUN +6283175551960",
    apiId: 25494748,
    apiHash: "0561b7417fd82f85b5fb9811244a27ba",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjIwMAG7hz+pdnZo1xIS9The2PjFG6OlH6z/t25TwZN/7OPLfR0CgnK4CoLIw2s4xWM5EbBbTL/+t2IJgN8AI240l0Ecy6+xSAJuyyVpt16XpU9YaZb99/MHeSuffxcSXNFeAGOcU1sCyA0LAVcONrswPhQP5nJQ3b1jWv+4xVcXMMZL52F5UQMNK/1iRM/7ubJRItEUbjAICMLoUe8FtSE51Sn5LeDgZ7Hz5sxrZR361lcQKuNYYTXYBYUW8dWTGDi1RjsSqjroViULTgae7Ql8AMackZRpFqc2b1w78NanZ/142zD0Asci0ZIfh+fnGvsxi8+cOo6a84MGDQKWQnOoYLTb0A=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [30, 33, 35, 38],
  },
  {
    name: "AKUN +6288276648966",
    apiId: 29587265,
    apiHash: "4111592828f7580d6b87b6d7199e59f5",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjIwMAG7ojp012XEiJMHBTr3tU/peN6recnG7mJpoTA5icFSZ78Pt8WOdOHFzq2PyR5W40bsXo80XkTuYALvAi9xcGNBLc7vfOaX5lN0fe+XfGZ4CqxrHBltF13r4qlTISiHnPtPdY0HtfGA7SenjKSReAzuXVW5X417EvpREhClDtdUGB/eWzFYiOLkJD03gHvfDcp58sySbXhIiGQP4yrdUh/i3euli2iJaghmtpVUP6ZIj86xVOq7OmemgnKQtWcVc1RqNemaSiHP2egv2JmsazGIFA/mRXv4HMQQwWBAvBPPuSVjnLINdauqI7UoewRJQo7TtRRBv8+I/WEpgu4+ZK+ZZQ=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [40, 43, 45, 48],
  },
  {
    name: "AKUN +6283175550412",
    apiId: `22467930`,
    apiHash: "aa8001b5a53dd34b332eacf1f5e82357",
    session: new StringSession(
      "1BQANOTEuMTA4LjU2LjIwMAG7HKS5OlKHIh5yo3lxo3EPmBxJbHnSRDa5YwaOhAvYw9g/1zH5r/AuVUwRn3rLrVZjRbMqQoAhYlqmyDnwNTZv5Lu1vzI3naosxzoVsWiHWUyxWt/uPnZOjhPoOcdu4AYZJGq2tek0s/0LfER4ruiRJ3a+v4Rpv3OJRh+AXk8NtCnmYe6Tew7NkliLC5k0+GtzX1P1PscNz/8jOZyw+RUyeardFKtHehQEn4X8Di0bzopUwxE+kpGHia7aB1+Z9yONv5bAAf8ABItKH5IdJmClVL8xYzLUVTbPTMJwmyA6/OjhihMmcHg6sUjWzVUHn7onjojuS0xTcxyCrgVb/iwu3Q=="
    ),
    groupUsernames: ["@lpm_seme_uke", "@LPM_DDK_BBG_MMK"],
    targetMinutes: [50, 53, 55, 58],
  },
  // Tambahkan akun lain di sini
];

// ---------- PESAN ----------
const messageToSend = `
ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

ch b0k*p bxb https://t.me/+GDXb7qYaLytkNDA1

#seme #uke #area
`.trim();

// ---------- SAFE GET ENTITY ----------
async function safeGetEntity(client, username, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.getEntity(username);
    } catch (err) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error(`Gagal getEntity setelah ${retries} percobaan: ${username}`);
}

// ---------- FUNGSI KIRIM PESAN ----------
async function sendMessage(account) {
  const client = new TelegramClient(
    account.session,
    account.apiId,
    account.apiHash,
    {
      connectionRetries: 5,
      autoReconnect: true,
      useWSS: false,
      timeout: 90000, // 30 detik
    }
  );

  try {
    await client.connect();

    for (const group of account.groupUsernames) {
      try {
        const entity = await safeGetEntity(client, group);
        await client.sendMessage(entity, { message: messageToSend });
        // delay acak 1-3 detik
        await new Promise((r) =>
          setTimeout(r, 1000 + Math.floor(Math.random() * 2000))
        );
      } catch (err) {
        // skip jika gagal kirim ke grup tertentu
      }
    }
  } catch (err) {
    // skip jika koneksi gagal
  } finally {
    try {
      await client.disconnect();
    } catch (err) {}
  }
}

// ---------- SCHEDULER MULTI-AKUN ----------
function scheduleAccount(account) {
  let isSending = false;

  setInterval(async () => {
    const now = new Date();
    if (account.targetMinutes.includes(now.getMinutes())) {
      if (isSending) return;
      isSending = true;
      try {
        await sendMessage(account);
      } finally {
        isSending = false;
      }
    }
  }, 60 * 1000);
}

// ---------- START SEMUA AKUN ----------
accounts.forEach((account) => {
  scheduleAccount(account);
});
