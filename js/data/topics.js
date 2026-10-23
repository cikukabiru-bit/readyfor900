// Readyfor900 — exam structure, based on the PUBLIC AZ-900 skills outline on Microsoft Learn.
// Unofficial; not affiliated with or endorsed by Microsoft.
window.READY = window.READY || {};

READY.outlineDate = "July 20, 2026";

READY.domains = [
  { id: "d1", name: "Cloud concepts", full: "Describe cloud concepts", weight: [25, 30] },
  { id: "d2", name: "Architecture & services", full: "Describe Azure architecture and services", weight: [35, 40] },
  { id: "d3", name: "Management & governance", full: "Describe Azure management and governance", weight: [30, 35] },
];

READY.topics = [
  { id: "d1-computing", domain: "d1", name: "Cloud computing", covers: "Shared responsibility, cloud models, consumption-based and pricing models, serverless" },
  { id: "d1-benefits", domain: "d1", name: "Benefits of the cloud", covers: "High availability, scalability, reliability, predictability, security, governance, manageability" },
  { id: "d1-types", domain: "d1", name: "Service types", covers: "IaaS, PaaS, SaaS and when to use each" },
  { id: "d2-core", domain: "d2", name: "Core architecture", covers: "Regions, region pairs, availability zones, resource groups, subscriptions, management groups" },
  { id: "d2-compute", domain: "d2", name: "Compute & networking", covers: "VMs, scale sets, containers, Functions, App Service, VNets, VPN Gateway, ExpressRoute, endpoints" },
  { id: "d2-storage", domain: "d2", name: "Storage", covers: "Storage services, access tiers, redundancy, moving data, migration" },
  { id: "d2-identity", domain: "d2", name: "Identity, access & security", covers: "Entra ID, SSO, MFA, Conditional Access, RBAC, Zero Trust, defense in depth, Defender for Cloud" },
  { id: "d3-cost", domain: "d3", name: "Cost management", covers: "Cost factors, pricing calculator, Cost Management, tags" },
  { id: "d3-governance", domain: "d3", name: "Governance & compliance", covers: "Microsoft Purview, Azure Policy, resource locks" },
  { id: "d3-tools", domain: "d3", name: "Managing & deploying", covers: "Portal, Cloud Shell, CLI, PowerShell, Azure Arc, IaC, ARM templates" },
  { id: "d3-monitoring", domain: "d3", name: "Monitoring", covers: "Azure Advisor, Service Health, Azure Monitor, Log Analytics, Application Insights" },
];
