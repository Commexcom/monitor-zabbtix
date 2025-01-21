import { ZabbixApiClient } from "@clients/zabbix-api/zabbix-api-client";
import { IZabbixSenderClient } from "@clients/zabbix-sender/zabbix-sender-client";
import config from "@config/index";
import { AppError } from "@errors/index";
import { MonitorService } from "@services/monitor-service";
import logger from "@utils/logger";

async function main() {
  try {
    const zabbixSender = new IZabbixSenderClient(
      config.zabbixServer,
      config.zabbixServerPort
    );
    const zabbixClient = new ZabbixApiClient(config.zabbixApiUrl);
    await zabbixClient.authorize(
      config.zabbixApiUsername,
      config.zabbixApiPassword
    );

    const monitorService = new MonitorService(zabbixClient, zabbixSender);

    await monitorService.updateLanLoadbalance();
  } catch (error) {
    if (error instanceof AppError) logger.error(error.message, error);

    logger.error("Erro inesperado:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : null,
      rawError: error,
    });
  }
}

main();
