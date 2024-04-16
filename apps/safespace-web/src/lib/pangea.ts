import { DomainIntelService, PangeaConfig } from "pangea-node-sdk";

let domainIntelService: InstanceType<typeof DomainIntelService> | null = null;

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
