import {
  DomainIntelService,
  PangeaConfig,
  URLIntelService,
  UserIntelService,
} from "pangea-node-sdk";

let domainIntelService: InstanceType<typeof DomainIntelService> | null = null;
let urlIntelService: InstanceType<typeof URLIntelService> | null = null;
let userIntelService: InstanceType<typeof UserIntelService> | null = null;

const getPangeaConfig = (): InstanceType<typeof PangeaConfig> => {
  return new PangeaConfig({
    domain: process.env.PANGEA_DOMAIN as string,
  });
};

export function getDomainIntelService(): InstanceType<
  typeof DomainIntelService
> {
  if (!domainIntelService) {
    const token = process.env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    domainIntelService = new DomainIntelService(token, config);
  }

  return domainIntelService;
}

export function getUrlIntelService(): InstanceType<typeof URLIntelService> {
  if (!urlIntelService) {
    const token = process.env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    urlIntelService = new URLIntelService(token, config);
  }

  return urlIntelService;
}

export function getUserIntelService(): InstanceType<typeof UserIntelService> {
  if (!userIntelService) {
    const token = process.env.PANGEA_TOKEN as string;

    const config = getPangeaConfig();

    userIntelService = new UserIntelService(token, config);
  }

  return userIntelService;
}
