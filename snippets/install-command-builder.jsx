export const InstallCommandBuilder = () => {
  const [mode, setMode] = useState("ip");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [customPorts, setCustomPorts] = useState(false);
  const [httpPort, setHttpPort] = useState("80");
  const [httpsPort, setHttpsPort] = useState("443");
  const [sshPort, setSshPort] = useState("22");
  const [externalDb, setExternalDb] = useState(false);
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [externalRedis, setExternalRedis] = useState(false);
  const [redisUrl, setRedisUrl] = useState("");
  const [llmProvider, setLlmProvider] = useState("openrouter");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [telemetry, setTelemetry] = useState(true);
  const [installDir, setInstallDir] = useState("");
  const [logLevel, setLogLevel] = useState("debug");
  const [copied, setCopied] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (mode === "domain" && domain) {
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}$/.test(domain)) {
        e.domain = "Enter a valid domain (e.g. panel.example.com)";
      }
    }
    if (mode === "domain" && !domain) {
      e.domain = "Domain is required in HTTPS mode";
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address";
    }
    if (customPorts) {
      const hp = parseInt(httpPort, 10);
      const hsp = parseInt(httpsPort, 10);
      const sp = parseInt(sshPort, 10);
      if (!hp || hp < 1 || hp > 65535) e.httpPort = "Port must be 1–65535";
      if (!hsp || hsp < 1 || hsp > 65535) e.httpsPort = "Port must be 1–65535";
      if (!sp || sp < 1 || sp > 65535) e.sshPort = "Port must be 1–65535";
      if (hp && hsp && hp === hsp) e.httpsPort = "HTTP and HTTPS ports must differ";
    }
    if (externalDb && databaseUrl) {
      if (!/^postgres(ql)?:\/\/.+/.test(databaseUrl)) {
        e.databaseUrl = "Must start with postgres:// or postgresql://";
      }
    }
    if (externalDb && !databaseUrl) {
      e.databaseUrl = "Database URL is required when using an external DB";
    }
    if (externalRedis && redisUrl) {
      if (!/^redis(s)?:\/\/.+/.test(redisUrl)) {
        e.redisUrl = "Must start with redis:// or rediss://";
      }
    }
    if (externalRedis && !redisUrl) {
      e.redisUrl = "Redis URL is required when using external Redis";
    }
    if (!llmApiKey) {
      e.llmApiKey = "API key is required";
    }
    if (installDir && !/^\/[a-zA-Z0-9/_-]+$/.test(installDir)) {
      e.installDir = "Must be an absolute path (e.g. /opt/nixopus)";
    }
    return e;
  }, [mode, domain, email, customPorts, httpPort, httpsPort, sshPort, externalDb, databaseUrl, externalRedis, redisUrl, llmProvider, llmApiKey, installDir]);

  const command = useMemo(() => {
    const vars = [];
    if (mode === "domain" && domain && !errors.domain) vars.push(`DOMAIN=${domain}`);
    if (email && !errors.email) vars.push(`ADMIN_EMAIL=${email}`);
    if (customPorts) {
      if (httpPort !== "80" && !errors.httpPort) vars.push(`CADDY_HTTP_PORT=${httpPort}`);
      if (httpsPort !== "443" && !errors.httpsPort) vars.push(`CADDY_HTTPS_PORT=${httpsPort}`);
      if (sshPort !== "22" && !errors.sshPort) vars.push(`SSH_PORT=${sshPort}`);
    }
    if (externalDb && databaseUrl && !errors.databaseUrl) vars.push(`DATABASE_URL="${databaseUrl}"`);
    if (externalRedis && redisUrl && !errors.redisUrl) vars.push(`REDIS_URL="${redisUrl}"`);
    if (llmApiKey && !errors.llmApiKey) {
      vars.push(`LLM_PROVIDER=${llmProvider}`);
      const keyVarMap = { openrouter: "OPENROUTER_API_KEY", openai: "OPENAI_API_KEY", anthropic: "ANTHROPIC_API_KEY", google: "GOOGLE_GENERATIVE_AI_API_KEY", deepseek: "DEEPSEEK_API_KEY", groq: "GROQ_API_KEY" };
      vars.push(`${keyVarMap[llmProvider]}=${llmApiKey}`);
    }
    if (!telemetry) vars.push("NIXOPUS_TELEMETRY=off");
    if (installDir && !errors.installDir) vars.push(`NIXOPUS_HOME=${installDir}`);
    if (logLevel !== "debug") vars.push(`LOG_LEVEL=${logLevel}`);

    const prefix = vars.length > 0 ? "sudo " + vars.join(" \\\n  ") + " \\\n  " : "sudo ";
    return `curl -fsSL install.nixopus.com | ${prefix}bash`;
  }, [mode, domain, email, customPorts, httpPort, httpsPort, sshPort, externalDb, databaseUrl, externalRedis, redisUrl, llmProvider, llmApiKey, telemetry, installDir, logLevel, errors]);

  const hasErrors = Object.keys(errors).length > 0;

  const copyCommand = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputBase = "w-full px-3 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/40 transition-shadow";
  const inputError = "border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500";
  const labelStyle = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";
  const errorStyle = "text-xs text-red-500 dark:text-red-400 mt-1";
  const sectionStyle = "space-y-3";
  const cardStyle = "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4";

  const Toggle = ({ checked, onChange, label, description }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-zinc-900 dark:bg-white" : "bg-zinc-300 dark:bg-zinc-600"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white dark:bg-zinc-900 transition-transform ${checked ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
      </button>
      <div>
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</div>
        {description && <div className="text-xs text-zinc-500 dark:text-zinc-400">{description}</div>}
      </div>
    </label>
  );

  return (
    <div className="not-prose space-y-5">
      {/* Access mode */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Access mode</div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("domain")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "domain" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"}`}
          >
            Domain (HTTPS)
          </button>
          <button
            onClick={() => setMode("ip")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "ip" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"}`}
          >
            IP (HTTP)
          </button>
        </div>
        {mode === "domain" && (
          <div className="mt-3">
            <label className={labelStyle}>Domain</label>
            <input
              type="text"
              placeholder="panel.example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={`${inputBase} ${errors.domain ? inputError : ""}`}
            />
            {errors.domain && <p className={errorStyle}>{errors.domain}</p>}
          </div>
        )}
      </div>

      {/* Admin */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Admin</div>
        <div className={sectionStyle}>
          <div>
            <label className={labelStyle}>Admin email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputBase} ${errors.email ? inputError : ""}`}
            />
            {errors.email && <p className={errorStyle}>{errors.email}</p>}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">First user to sign up becomes admin. OTP is logged if no email provider is configured.</p>
          </div>
        </div>
      </div>

      {/* Ports */}
      <div className={cardStyle}>
        <Toggle
          checked={customPorts}
          onChange={setCustomPorts}
          label="Custom ports"
          description="Change from the default 80/443 if those are in use"
        />
        {customPorts && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className={labelStyle}>HTTP port</label>
              <input type="number" min="1" max="65535" value={httpPort} onChange={(e) => setHttpPort(e.target.value)} className={`${inputBase} ${errors.httpPort ? inputError : ""}`} />
              {errors.httpPort && <p className={errorStyle}>{errors.httpPort}</p>}
            </div>
            <div>
              <label className={labelStyle}>HTTPS port</label>
              <input type="number" min="1" max="65535" value={httpsPort} onChange={(e) => setHttpsPort(e.target.value)} className={`${inputBase} ${errors.httpsPort ? inputError : ""}`} />
              {errors.httpsPort && <p className={errorStyle}>{errors.httpsPort}</p>}
            </div>
            <div>
              <label className={labelStyle}>SSH port</label>
              <input type="number" min="1" max="65535" value={sshPort} onChange={(e) => setSshPort(e.target.value)} className={`${inputBase} ${errors.sshPort ? inputError : ""}`} />
              {errors.sshPort && <p className={errorStyle}>{errors.sshPort}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Data stores */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Data stores</div>
        <div className="space-y-4">
          <div>
            <Toggle
              checked={externalDb}
              onChange={setExternalDb}
              label="External Postgres"
              description="Use your own database instead of the bundled one"
            />
            {externalDb && (
              <div className="mt-2 ml-12">
                <input
                  type="text"
                  placeholder="postgres://user:pass@host:5432/nixopus"
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  className={`${inputBase} ${errors.databaseUrl ? inputError : ""}`}
                />
                {errors.databaseUrl && <p className={errorStyle}>{errors.databaseUrl}</p>}
              </div>
            )}
          </div>
          <div>
            <Toggle
              checked={externalRedis}
              onChange={setExternalRedis}
              label="External Redis"
              description="Use your own Redis instead of the bundled one"
            />
            {externalRedis && (
              <div className="mt-2 ml-12">
                <input
                  type="text"
                  placeholder="redis://default:pass@host:6379"
                  value={redisUrl}
                  onChange={(e) => setRedisUrl(e.target.value)}
                  className={`${inputBase} ${errors.redisUrl ? inputError : ""}`}
                />
                {errors.redisUrl && <p className={errorStyle}>{errors.redisUrl}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Agent */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">AI Agent — LLM Provider</div>
        <div>
          <label className={labelStyle}>Provider</label>
          <select
            value={llmProvider}
            onChange={(e) => { setLlmProvider(e.target.value); setLlmApiKey(""); }}
            className={inputBase}
          >
            <option value="openrouter">OpenRouter — Claude, GPT-4, Gemini & more</option>
            <option value="openai">OpenAI — GPT-4o</option>
            <option value="anthropic">Anthropic — Claude Sonnet</option>
            <option value="google">Google — Gemini 2.5 Flash</option>
            <option value="deepseek">DeepSeek — DeepSeek Chat</option>
            <option value="groq">Groq — Llama 3.3 70B</option>
          </select>
        </div>
        <div className="mt-3">
          <label className={labelStyle}>
            {({ openrouter: "OpenRouter", openai: "OpenAI", anthropic: "Anthropic", google: "Google AI", deepseek: "DeepSeek", groq: "Groq" })[llmProvider]} API key
          </label>
          <input
            type="text"
            placeholder={({ openrouter: "sk-or-v1-...", openai: "sk-...", anthropic: "sk-ant-...", google: "AI...", deepseek: "sk-...", groq: "gsk_..." })[llmProvider]}
            value={llmApiKey}
            onChange={(e) => setLlmApiKey(e.target.value)}
            className={`${inputBase} ${errors.llmApiKey ? inputError : ""}`}
          />
          {errors.llmApiKey && <p className={errorStyle}>{errors.llmApiKey}</p>}
          {llmProvider === "openrouter" && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Get a key at{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">openrouter.ai/keys</a>
            </p>
          )}
        </div>
      </div>

      {/* Advanced */}
      <div className={cardStyle}>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Advanced</div>
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Install directory</label>
            <input
              type="text"
              placeholder="/opt/nixopus (default)"
              value={installDir}
              onChange={(e) => setInstallDir(e.target.value)}
              className={`${inputBase} ${errors.installDir ? inputError : ""}`}
            />
            {errors.installDir && <p className={errorStyle}>{errors.installDir}</p>}
          </div>
          <div>
            <label className={labelStyle}>Log level</label>
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className={inputBase}
            >
              <option value="debug">debug (default)</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="error">error</option>
            </select>
          </div>
          <Toggle
            checked={telemetry}
            onChange={setTelemetry}
            label="Anonymous telemetry"
            description="Sends OS name, arch, version, and install duration — no personal data"
          />
        </div>
      </div>

      {/* Generated command */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
          <span className="text-xs font-medium text-zinc-400">Install command</span>
          <button
            onClick={copyCommand}
            disabled={hasErrors}
            className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${hasErrors ? "text-zinc-600 cursor-not-allowed" : copied ? "text-green-400 bg-green-400/10" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-zinc-100 leading-relaxed">
          <code>{command}</code>
        </pre>
      </div>

      {hasErrors && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-4 py-3">
          <p className="text-sm text-amber-800 dark:text-amber-200">Fix the highlighted fields above before copying the command.</p>
        </div>
      )}
    </div>
  );
};
