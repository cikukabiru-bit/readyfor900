// Readyfor900 — ORIGINAL practice questions written for this app. Unofficial; not affiliated with or endorsed by Microsoft.
// Domain: Describe Azure management and governance (30–35%)
window.READY = window.READY || {};
READY.questions = (READY.questions || []).concat([
  {
    id: "d3-q01",
    topic: "d3-cost",
    level: 1,
    q: "Which type of data transfer is usually free in Azure?",
    options: [
      "Data leaving Azure to users on the internet (outbound)",
      "Data moving between two different Azure regions",
      "Data coming into Azure from outside (inbound)",
      "Data sent from Azure to your office over a VPN connection"
    ],
    answer: 2,
    why: "Most inbound data transfer (data going into Azure) is free. Data leaving Azure and data moving between Azure regions is billed, which is why network traffic is one of the factors that affect cost — along with resource type, how much you use, the region, subscription type and Azure Marketplace purchases.",
    wrong: [
      "Outbound data (egress) leaving Azure is billed.",
      "Data moving between Azure regions is billed, so placing chatty resources in different regions adds cost.",
      null,
      "This is outbound data leaving Azure, which is billed (and the VPN gateway itself also has a cost)."
    ],
    tip: "Like a market with free entry where the lorries leaving with goods pay a fee: data in is free, data out costs."
  },
  {
    id: "d3-q02",
    topic: "d3-cost",
    level: 2,
    q: "What is the difference between the Azure pricing calculator and Cost Management?",
    options: [
      "The pricing calculator shows your actual bill; Cost Management estimates costs before you deploy",
      "The pricing calculator estimates costs before you deploy; Cost Management shows and analyses what you actually spend",
      "They do the same job; Cost Management is simply the newer name for the pricing calculator"
    ],
    answer: 1,
    why: "Use the pricing calculator to plan: it is a public web tool where you pick services, regions and options to estimate a monthly cost before deploying anything. Use Cost Management after deploying to see and analyse actual spending, create budgets and set alerts.",
    wrong: [
      "This is the wrong way round: the calculator gives estimates, while Cost Management works with your real spending data.",
      null,
      "They are separate tools with different jobs — one estimates planned costs, the other tracks actual costs."
    ],
    tip: "The pricing calculator is the fundi's quote before building starts; Cost Management is the pile of receipts once work begins."
  },
  {
    id: "d3-q03",
    topic: "d3-cost",
    level: 3,
    q: "A Nairobi school's computer club has USD 150 a month to spend on Azure. The club patron wants an email when spending reaches 80% of that amount. What should she set up?",
    options: [
      "A ReadOnly resource lock on the subscription",
      "An Azure Policy that denies new virtual machines",
      "Azure Advisor cost recommendations",
      "A budget in Cost Management with an alert at 80%"
    ],
    answer: 3,
    why: "In Cost Management you can create a budget for a scope such as a subscription or resource group, and add alert thresholds like 80% and 100%. When spending crosses a threshold, the chosen people get an email. A budget alert warns you; by itself it does not switch resources off.",
    wrong: [
      "A ReadOnly lock stops changes to resources; it doesn't watch spending or send cost emails.",
      "A policy can limit what gets deployed, but it doesn't track spending against an amount or send budget emails.",
      "Advisor suggests ways to save money (such as resizing underused VMs) but doesn't track spending against a budget you set.",
      null
    ],
    tip: "A budget alert is like the chama treasurer warning members that the month's spending is close to the agreed limit — a warning, not a lock on the cashbox."
  },
  {
    id: "d3-q04",
    topic: "d3-cost",
    level: 1,
    q: "What are tags in Azure?",
    options: [
      "Name/value pairs added to resources to organise them, for example department = finance",
      "Settings that stop a resource from being deleted or changed by mistake",
      "Rules that limit which regions or VM sizes people are allowed to use",
      "Containers that group related resources which share the same lifecycle"
    ],
    answer: 0,
    why: "Tags are labels made of a name and a value, such as environment = production or project = clinic-app. You can filter and group by them — including in Cost Management, to see which team or project is spending what — and automation can use them to find the right resources.",
    wrong: [
      null,
      "That describes resource locks (Delete and ReadOnly).",
      "That describes Azure Policy, which enforces rules such as allowed locations or VM sizes.",
      "That describes resource groups."
    ],
    tip: "Tags are like name stickers on school lunchboxes: they don't change what's inside, but everyone knows whose box it is."
  },
  {
    id: "d3-q05",
    topic: "d3-cost",
    level: 2,
    q: "A Lagos fintech adds the tag department = payments to a resource group. Later, its cost reports show the resources inside that group without the tag. What is the most likely reason?",
    options: [
      "Tags can only be added to virtual machines",
      "A resource group can hold only one tag",
      "Resources don't automatically inherit tags from their resource group",
      "Tags can only be added with Azure PowerShell, not the portal"
    ],
    answer: 2,
    why: "Tags are not inherited automatically: a tag on a resource group stays on the resource group. To make the resources carry the same tag, add it to each resource or use Azure Policy to add or inherit tags automatically.",
    wrong: [
      "Most Azure resource types, as well as resource groups and subscriptions, support tags — not just VMs.",
      "Resources, resource groups and subscriptions can each have many tags, not just one.",
      null,
      "Tags can be added in the portal, Azure CLI, Azure PowerShell, ARM templates or Bicep."
    ],
    tip: "Labelling the matatu doesn't label every passenger's bag — tag each resource, or let Azure Policy do it for you."
  },
  {
    id: "d3-q06",
    topic: "d3-governance",
    level: 1,
    q: "Which resource lock lets people change a resource's settings but blocks anyone from deleting it?",
    options: [
      "ReadOnly lock",
      "Delete (CanNotDelete) lock",
      "Reader role assignment",
      "A tag such as protect = yes"
    ],
    answer: 1,
    why: "A Delete lock (called CanNotDelete in code) lets authorised users read and modify a resource but not delete it. A ReadOnly lock blocks both changes and deletion. Locks apply to everyone, including Owners, until the lock is removed.",
    wrong: [
      "A ReadOnly lock blocks changes as well as deletion — stricter than this scenario needs.",
      null,
      "Reader is an Azure RBAC role assigned to users or groups: it allows viewing only, so it would block changes too, and it isn't a lock on the resource.",
      "Tags are only labels; they don't protect anything from deletion."
    ],
    tip: "Delete lock = you can rearrange the furniture, but you can't knock the house down."
  },
  {
    id: "d3-q07",
    topic: "d3-governance",
    level: 3,
    q: "At a hospital in Mombasa, the cloud admin has the Owner role. Some weeks ago she placed a ReadOnly lock on the resource group that holds the patient database. Today her attempt to scale up the database fails. What should she do?",
    options: [
      "Ask for the Contributor role, because Owners cannot scale databases",
      "Wait for the lock to expire, which happens automatically after a set time",
      "Make the change from Azure CLI instead, because locks only apply in the portal",
      "Remove the ReadOnly lock, make the change, then put the lock back"
    ],
    answer: 3,
    why: "A ReadOnly lock blocks changes and deletion for everyone, even Owners. Because it was placed on the resource group, the resources inside inherit it. Someone with permission to manage locks, such as an Owner, must remove the lock before the change can go through.",
    wrong: [
      "Owner already has more permissions than Contributor; the problem is the lock, which applies whatever role you have.",
      "Locks never expire on their own; they stay until someone with permission removes them.",
      "Locks are enforced by Azure Resource Manager, so they apply equally to the portal, Azure CLI, Azure PowerShell and templates.",
      null
    ],
    tip: "A lock is like a padlock on the store: even the owner has to unlock it before taking anything out."
  },
  {
    id: "d3-q08",
    topic: "d3-governance",
    level: 2,
    q: "A health-records start-up in Johannesburg wants Azure to reject any new resource that is not created in South Africa North or South Africa West. Which service should it use?",
    options: [
      "Azure Policy",
      "Azure role-based access control (RBAC)",
      "A Delete resource lock",
      "Microsoft Purview"
    ],
    answer: 0,
    why: "Azure Policy lets you create rules about resource properties, such as allowed locations or allowed VM sizes. A policy can deny deployments that break the rule, and existing resources are checked and reported as compliant or non-compliant. Related policies can be grouped into an initiative.",
    wrong: [
      null,
      "RBAC controls WHO can do what (for example, who may create resources), not which regions resources may use.",
      "A Delete lock only stops existing resources from being deleted; it doesn't check where new ones are created.",
      "Microsoft Purview helps you understand and govern your data; it doesn't block Azure deployments in particular regions."
    ],
    tip: "RBAC decides WHO may enter the estate; Azure Policy decides WHAT kind of house may be built there."
  },
  {
    id: "d3-q09",
    topic: "d3-governance",
    level: 1,
    q: "Which family of solutions helps an organisation discover, classify and govern its data across on-premises systems, multiple clouds and SaaS apps, and manage risk and compliance?",
    options: [
      "Azure Policy",
      "Azure Arc",
      "Microsoft Purview",
      "Azure Monitor"
    ],
    answer: 2,
    why: "Microsoft Purview is a family of data governance, risk and compliance solutions. It helps you find out what data you have and where it lives — on-premises, in Azure, in other clouds and in SaaS apps — label sensitive data, and manage risk and compliance.",
    wrong: [
      "Azure Policy enforces rules on resource settings (like allowed regions); it doesn't catalogue or classify the data inside them.",
      "Azure Arc extends Azure management to servers and Kubernetes outside Azure; it isn't a data governance and compliance solution.",
      null,
      "Azure Monitor collects and analyses telemetry such as metrics and logs; it doesn't classify business data for compliance."
    ],
    tip: "Purview gives you a 'view' of all your data — like a records office that knows what every file is and who should see it."
  },
  {
    id: "d3-q10",
    topic: "d3-tools",
    level: 1,
    q: "What is Azure Cloud Shell?",
    options: [
      "A free desktop app for browsing and managing the files in storage accounts",
      "The web-based graphical interface where you manage resources by clicking",
      "A JSON file format for describing the resources you want to deploy",
      "A browser-based command line with Bash or PowerShell and Azure tools ready to use"
    ],
    answer: 3,
    why: "Cloud Shell opens a command-line session in your browser, for example from the Azure portal. You choose Bash or PowerShell, and tools such as Azure CLI and Azure PowerShell are already installed and authenticated with your account, so there is nothing to install on your own computer.",
    wrong: [
      "That describes Azure Storage Explorer, a free graphical app for working with storage.",
      "That describes the Azure portal, the web-based graphical interface.",
      "That describes an ARM template, a declarative JSON file for deployments.",
      null
    ],
    tip: "Cloud Shell is a terminal you can open from any browser — handy on a cyber café PC where you can't install anything."
  },
  {
    id: "d3-q11",
    topic: "d3-tools",
    level: 2,
    q: "Amina manages Azure by typing commands like az vm list, while Kwame types commands like Get-AzVM. Which statement is correct?",
    options: [
      "Amina uses Azure PowerShell and Kwame uses Azure CLI",
      "Amina uses Azure CLI and Kwame uses Azure PowerShell; both can manage the same resources",
      "Both are writing Bicep, which is then compiled into ARM templates",
      "Amina's commands only work on Linux and Kwame's only work on Windows"
    ],
    answer: 1,
    why: "Azure CLI commands start with az. Azure PowerShell uses cmdlets in a Verb-Noun style, such as Get-AzVM or New-AzVM. Both send their requests to Azure Resource Manager, so they can do the same jobs — pick the one that suits you.",
    wrong: [
      "It's the other way round: az commands belong to Azure CLI, and Verb-Noun cmdlets like Get-AzVM belong to Azure PowerShell.",
      null,
      "Bicep is a language for writing infrastructure-as-code files, not for typing interactive commands like these.",
      "Both Azure CLI and Azure PowerShell are cross-platform: they run on Windows, Linux and macOS, and in Cloud Shell."
    ],
    tip: "Starts with 'az' = Azure CLI; looks like Verb-AzNoun = Azure PowerShell."
  },
  {
    id: "d3-q12",
    topic: "d3-tools",
    level: 3,
    q: "A logistics company in Dar es Salaam runs some servers in its own server room and others with another cloud provider. It wants to keep them where they are, but apply Azure Policy to them and monitor them from the Azure portal. What should it use?",
    options: [
      "Azure Migrate",
      "Azure Arc",
      "Azure ExpressRoute",
      "Azure Virtual Desktop"
    ],
    answer: 1,
    why: "Azure Arc extends Azure management to resources outside Azure — such as servers, Kubernetes clusters and data services on-premises or in other clouds. They appear in Azure so you can use Azure Policy, RBAC and monitoring on them, which makes hybrid and multi-cloud setups easier to govern.",
    wrong: [
      "Azure Migrate helps you discover, assess and MOVE servers into Azure, but the company wants to keep them where they are.",
      null,
      "ExpressRoute is a private network connection to Azure; it doesn't bring outside servers under Azure management.",
      "Azure Virtual Desktop delivers Windows desktops and apps from the cloud; it doesn't manage servers in other environments."
    ],
    tip: "Arc stretches Azure's management like an arch over everything you run, wherever it sits."
  },
  {
    id: "d3-q13",
    topic: "d3-tools",
    level: 3,
    q: "A software company in Cairo builds its test and production environments by clicking through the Azure portal, and small differences between them keep causing bugs. Which approach would best fix this?",
    options: [
      "Describe the environments in Bicep or ARM template files and deploy them from those files",
      "Write a step-by-step guide so every engineer clicks the same options in the portal",
      "Place ReadOnly locks on both environments",
      "Turn on Azure Advisor recommendations for both environments"
    ],
    answer: 0,
    why: "Infrastructure as code (IaC) means describing your infrastructure in files. Deploying from the same Bicep or ARM template files gives the same result every time, and the files can be kept in version control and reviewed like any other code.",
    wrong: [
      null,
      "Manual clicking is still easy to get wrong; a written guide doesn't make deployments repeatable the way code does.",
      "ReadOnly locks stop changes, but they don't make the two environments identical in the first place.",
      "Advisor gives best-practice recommendations; it doesn't build matching environments for you."
    ],
    tip: "Infrastructure as code is like a recipe card: follow the same card and every batch of mandazi comes out the same."
  },
  {
    id: "d3-q14",
    topic: "d3-tools",
    level: 1,
    q: "Before Azure deploys a Bicep file, what is the file converted into?",
    options: [
      "A PowerShell script",
      "A YAML pipeline file",
      "A set of Azure CLI commands",
      "An ARM template written in JSON"
    ],
    answer: 3,
    why: "Bicep is a simpler, easier-to-read language for infrastructure as code. A Bicep file compiles into an ARM template — a declarative JSON file — which Azure Resource Manager then deploys. ARM is the service that handles every create, update and delete request, whether it comes from the portal, CLI, PowerShell or a template.",
    wrong: [
      "Azure PowerShell can start a Bicep deployment, but Bicep isn't turned into a PowerShell script.",
      "YAML is used by some CI/CD pipelines, but Bicep compiles to JSON, not YAML.",
      "Azure CLI can start a Bicep deployment, but Bicep isn't converted into CLI commands.",
      null
    ],
    tip: "Bicep is the friendly version you write; ARM template JSON is what Azure Resource Manager actually reads."
  },
  {
    id: "d3-q15",
    topic: "d3-monitoring",
    level: 2,
    q: "The IT officer at a Nairobi NGO wants free, personalised tips on which VMs are underused, which resources have no backup and how to improve security. Which service gives these recommendations?",
    options: [
      "Azure Service Health",
      "Azure Advisor",
      "Microsoft Defender for Cloud",
      "Azure Policy"
    ],
    answer: 1,
    why: "Azure Advisor analyses your resources and how you use them, then gives personalised recommendations in five categories: reliability, security, performance, operational excellence and cost. Each recommendation explains the issue and how to act on it.",
    wrong: [
      "Service Health tells you about Azure incidents and planned maintenance that affect you, not how to improve your own resources.",
      null,
      "Defender for Cloud focuses on security posture and threat protection; it won't advise on underused VMs to cut costs.",
      "Azure Policy enforces rules you define; it doesn't study your usage and suggest improvements."
    ],
    tip: "Remember Advisor's five areas with 'Really Smart People Optimise Costs': Reliability, Security, Performance, Operational excellence, Cost."
  },
  {
    id: "d3-q16",
    topic: "d3-monitoring",
    level: 3,
    q: "An online pharmacy in Abuja reports that its order-processing VM has stopped responding. The admin wants to know whether that specific VM is affected by an Azure platform problem. Where should she look first?",
    options: [
      "Azure status",
      "Service Health",
      "Resource Health",
      "Azure Advisor"
    ],
    answer: 2,
    why: "Azure Service Health has three parts. Azure status gives a global view of the health of Azure services in all regions. Service Health shows incidents, planned maintenance and health advisories for the services and regions you use. Resource Health zooms in on your individual resources, such as one VM, and shows whether they are available.",
    wrong: [
      "Azure status shows the health of Azure services across all regions worldwide — useful for big outages, but not focused on her VM.",
      "Service Health covers the services and regions you use (incidents, planned maintenance, advisories), not the health of one individual resource.",
      null,
      "Advisor gives best-practice recommendations; it doesn't report a resource's current health."
    ],
    tip: "Think zoom levels: Azure status = the whole country's weather, Service Health = your town's forecast, Resource Health = is it raining on YOUR house?"
  },
  {
    id: "d3-q17",
    topic: "d3-monitoring",
    level: 1,
    q: "In Azure Monitor, which tool do you use to write and run queries on collected log data using Kusto Query Language (KQL)?",
    options: [
      "Log Analytics",
      "Application Insights",
      "Azure Monitor alerts",
      "Resource Health"
    ],
    answer: 0,
    why: "Log Analytics is the Azure Monitor tool for working with log data. You write KQL queries to search, filter, summarise and chart logs — for example, listing every error a VM recorded in the last hour.",
    wrong: [
      null,
      "Application Insights is the feature for monitoring web application performance and usage, not the query tool itself.",
      "Alerts notify you or take action when a condition is met; they aren't where you write and explore queries.",
      "Resource Health, part of Azure Service Health, shows whether your individual resources are available."
    ],
    tip: "Logs plus queries = Log Analytics."
  },
  {
    id: "d3-q18",
    topic: "d3-monitoring",
    level: 2,
    q: "Developers at an Accra online shop want to see why their web app is slow: response times, failed requests, exceptions and which pages customers use most. Which Azure Monitor feature is built for this?",
    options: [
      "Azure Monitor alerts",
      "Log Analytics",
      "Azure Advisor",
      "Application Insights"
    ],
    answer: 3,
    why: "Application Insights is Azure Monitor's application performance monitoring (APM) feature. It collects data such as request rates, response times, failures, exceptions and page views, helping developers find and fix problems. Azure Monitor alerts can then notify the team when something goes wrong.",
    wrong: [
      "Alerts notify you (or trigger an action) when a condition is met, such as high CPU; they don't give detailed application performance data.",
      "Log Analytics is where you query log data with KQL; it isn't the application performance monitoring feature itself.",
      "Advisor gives best-practice recommendations; it doesn't trace requests and exceptions inside your web app.",
      null
    ],
    tip: "Application Insights gives insights into your APPLICATION; Azure Monitor alerts are the alarm bell."
  }
]);
