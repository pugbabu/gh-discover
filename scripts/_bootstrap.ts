// 仅供 dev 脚本：让 node 的 fetch 走 HTTP_PROXY/HTTPS_PROXY（沙箱代理下才需要）。
// 生产环境无这些变量时不生效，不影响线上直连。
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}
