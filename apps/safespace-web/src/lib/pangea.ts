import { env } from "@/utils/env";
import {
  DomainIntelService,
  PangeaConfig,
  URLIntelService,
  UserIntelService,
  AuthNService,
  VaultService,
  RedactService,
} from "pangea-node-sdk";

let domainIntelService: InstanceType<typeof DomainIntelService> | null = null;
let urlIntelService: InstanceType<typeof URLIntelService> | null = null;
let userIntelService: InstanceType<typeof UserIntelService> | null = null;
let authNService: InstanceType<typeof AuthNService> | null = null;
let vaultService: InstanceType<typeof VaultService> | null = null;
let redactService: InstanceType<typeof RedactService> | null = null;

const getPangeaConfig = (): InstanceType<typeof PangeaConfig> => {
  return new PangeaConfig({
    domain: env.PANGEA_DOMAIN as string,
  });
};

export function getDomainIntelService(): InstanceType<
  typeof DomainIntelService
> {
  if (!domainIntelService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    domainIntelService = new DomainIntelService(token, config);
  }

  return domainIntelService;
}

export function getUrlIntelService(): InstanceType<typeof URLIntelService> {
  if (!urlIntelService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    urlIntelService = new URLIntelService(token, config);
  }

  return urlIntelService;
}

export function getUserIntelService(): InstanceType<typeof UserIntelService> {
  if (!userIntelService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    userIntelService = new UserIntelService(token, config);
  }

  return userIntelService;
}

export function getAuthNService(): InstanceType<typeof AuthNService> {
  if (!authNService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    authNService = new AuthNService(token, config);
  }

  return authNService;
}

export function getVaultService(): InstanceType<typeof VaultService> {
  if (!vaultService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    vaultService = new VaultService(token, config);
  }

  return vaultService;
}

export function getRedactService(): InstanceType<typeof RedactService> {
  if (!redactService) {
    const token = env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    redactService = new RedactService(token, config);
  }
  return redactService;
}
