// Readyfor900 — ORIGINAL practice questions written for this app. Unofficial; not affiliated with or endorsed by Microsoft.
// Domain: Describe cloud concepts (25–30%)
window.READY = window.READY || {};
READY.questions = (READY.questions || []).concat([
  {
    id: "d1-q01",
    topic: "d1-computing",
    level: 1,
    q: "Which statement best describes cloud computing?",
    options: [
      "Buying servers and running every application on them inside your own building",
      "Renting computing services such as servers, storage and software over the internet, and paying for what you use",
      "Linking the computers in one office with cables so they can share files and printers",
      "Copying important files onto external hard drives that are kept at a second site"
    ],
    answer: 1,
    why: "Cloud computing means getting computing services — servers, storage, databases, networking and software — from a provider over the internet. You use them when you need them and usually pay only for what you use, instead of buying and running all the hardware yourself.",
    wrong: [
      "This is on-premises computing: you own, house and maintain all the hardware yourself.",
      null,
      "This is a local area network (LAN); it connects machines in one place but isn't a cloud service.",
      "This is an off-site backup routine; it doesn't give you computing services on demand."
    ],
    tip: "Cloud is like taking a matatu instead of buying a car: you pay the fare for the ride, and someone else owns and maintains the vehicle."
  },
  {
    id: "d1-q02",
    topic: "d1-computing",
    level: 1,
    q: "Under the shared responsibility model, which of these is ALWAYS the customer's responsibility, whether they use IaaS, PaaS or SaaS?",
    options: [
      "Installing operating system updates",
      "Physical security of the datacenter",
      "The data and information they store",
      "Running and maintaining the application"
    ],
    answer: 2,
    why: "Whatever the service type, the customer always owns its data and information, the devices that connect (phones, laptops) and its user accounts and identities. The provider always looks after the physical datacenter, physical network and physical hosts.",
    wrong: [
      "This varies: the customer patches the OS in IaaS, but the provider manages the OS in PaaS and SaaS.",
      "Physical datacenter security is ALWAYS the cloud provider's job, never the customer's.",
      null,
      "This varies: you run your own application in IaaS and PaaS, but in SaaS the provider runs the application."
    ],
    tip: "Like renting a flat: the landlord owns the building and the gate, but what you keep inside — and who you give your keys to — is on you."
  },
  {
    id: "d1-q03",
    topic: "d1-computing",
    level: 3,
    q: "A clinic in Kigali moves its appointment system onto Azure virtual machines (IaaS). Who is responsible for installing operating system security updates on those VMs?",
    options: [
      "The clinic, because in IaaS the customer manages the operating system",
      "Microsoft, because it owns the physical servers the VMs run on",
      "Microsoft, because every Azure service is fully managed by Microsoft",
      "Microsoft for Windows VMs, and the clinic for Linux VMs"
    ],
    answer: 0,
    why: "In IaaS, Microsoft looks after the physical datacenter, network and host servers, but the customer manages the guest operating system — including security updates. Azure has tools that help schedule updates, but deciding on and applying them is still the clinic's job.",
    wrong: [
      null,
      "Microsoft does own and maintain the physical hosts, but the operating system running inside an IaaS VM belongs to the customer.",
      "Not every Azure service is fully managed: with IaaS you get a VM and manage the OS yourself; PaaS and SaaS are the managed options.",
      "The OS brand doesn't change the rule: in IaaS the customer patches the guest OS, whether it is Windows or Linux."
    ],
    tip: "IaaS is like renting a house shell: the landlord fixes the roof and pipes, but you maintain everything you put inside — starting with the OS."
  },
  {
    id: "d1-q04",
    topic: "d1-computing",
    level: 3,
    q: "A cocoa cooperative in Kumasi, Ghana, keeps its members' payment records on servers in its own office. It wants to run its public website on Azure so it can handle the rush of buyers in harvest season, with both parts working together. Which cloud model is this?",
    options: [
      "Public cloud",
      "Private cloud",
      "Hybrid cloud",
      "Multi-cloud"
    ],
    answer: 2,
    why: "Hybrid cloud combines on-premises (or private cloud) resources with public cloud resources, connected so they work together. It suits organisations that need to keep some data in-house but want the public cloud's flexibility for other workloads, such as a website with seasonal peaks.",
    wrong: [
      "A public-cloud-only setup would put everything on the provider's shared hardware, but the payment records stay on the cooperative's own servers.",
      "A private cloud serves one organisation only, often on its own premises; it doesn't describe also using Azure's public services for the website.",
      null,
      "Multi-cloud means using more than one cloud provider; here only one provider (Azure) is combined with on-premises servers."
    ],
    tip: "Hybrid is like a farmer who keeps the family store at home but rents a stall at the market in harvest season — both are used together."
  },
  {
    id: "d1-q05",
    topic: "d1-computing",
    level: 2,
    q: "Why is the cloud's consumption-based model usually described as operational expenditure (OpEx) rather than capital expenditure (CapEx)?",
    options: [
      "You buy servers up front and spread their cost over several years",
      "You pay the same fixed monthly fee however much you use",
      "You pay for services as you use them, with no big up-front hardware purchase",
      "Cloud services always cost less in total than running your own servers"
    ],
    answer: 2,
    why: "With the consumption-based model you pay for the resources you actually use, as you use them. That is an ongoing operating cost (OpEx), not a large up-front investment in equipment (CapEx), and the bill goes up or down with your usage.",
    wrong: [
      "Buying hardware up front and spreading its cost over years is capital expenditure (CapEx) — the on-premises way.",
      "Consumption-based means the bill rises and falls with use; it isn't a fixed fee.",
      null,
      "OpEx vs CapEx is about HOW you pay, not how much; the cloud is not automatically cheaper for every workload."
    ],
    tip: "Consumption-based pricing works like prepaid electricity tokens: you pay for the units you use, not for building the power station."
  },
  {
    id: "d1-q06",
    topic: "d1-computing",
    level: 1,
    q: "Which Azure pricing option gives a large discount by using spare capacity, but Azure can evict (stop) your virtual machine when it needs that capacity back?",
    options: [
      "Reservations",
      "Pay-as-you-go",
      "Savings plan",
      "Spot"
    ],
    answer: 3,
    why: "Azure Spot Virtual Machines run on Azure's unused capacity at a deep discount. The catch is that Azure can evict them with little warning, so they suit work that can be interrupted and restarted, such as batch jobs, testing or rendering.",
    wrong: [
      "Reservations give a discount in exchange for committing to a resource for one or three years; reserved VMs are not evicted.",
      "Pay-as-you-go is billed by use with no commitment and no special discount; your VM isn't evicted.",
      "A savings plan gives a discount for committing to spend a fixed hourly amount on compute for one or three years; it doesn't use evictable capacity.",
      null
    ],
    tip: "Spot is like a cheap standby seat: a great price, but you may have to get off when a full-fare passenger arrives."
  },
  {
    id: "d1-q07",
    topic: "d1-computing",
    level: 2,
    q: "Which statement about serverless computing, such as Azure Functions, is correct?",
    options: [
      "Servers still exist, but the provider manages them; code runs on events and you pay per use",
      "No servers are involved at all; the code runs directly on each user's own phone or laptop",
      "You pick the virtual machine size and install operating system updates yourself",
      "You pay a fixed monthly price for a dedicated server that runs all day and night"
    ],
    answer: 0,
    why: "'Serverless' doesn't mean there are no servers — it means you don't manage them. The provider runs the infrastructure, your code or workflow runs in response to events (like an HTTP request or a new file), and you are billed for the executions or resources used. Azure Functions and Azure Logic Apps are common examples.",
    wrong: [
      null,
      "Serverless code still runs on servers in the provider's datacenters; you just never see or manage them.",
      "Choosing VM sizes and patching the OS is IaaS work, which serverless removes.",
      "Paying for an always-on server is the opposite of serverless, where you pay for what actually runs."
    ],
    tip: "Serverless is like a boda boda: you don't own or service the bike — you just pay for the ride when you need it."
  },
  {
    id: "d1-q08",
    topic: "d1-benefits",
    level: 2,
    q: "On results day, traffic to a Nairobi school's results portal jumps. The portal automatically adds more identical web servers to share the load, then removes them when traffic drops. What is this?",
    options: [
      "Vertical scaling (scale up/down)",
      "Horizontal scaling (scale out/in)",
      "High availability",
      "Geo-redundancy"
    ],
    answer: 1,
    why: "Adding or removing instances is horizontal scaling: scaling out when demand rises and in when it falls. Because it happens automatically as demand changes, this is also called elasticity. Scalability and high availability often work together: with several servers, the portal can also keep running if one fails.",
    wrong: [
      "Vertical scaling makes one machine bigger or smaller (more or less CPU and memory) instead of adding more machines.",
      null,
      "High availability means keeping a service up with minimal downtime, usually promised as an uptime percentage in an SLA; this scenario is about matching capacity to demand.",
      "Geo-redundancy keeps copies in another region for disaster recovery; it doesn't add servers to handle a traffic peak."
    ],
    tip: "Scale out = put more matatus on the route; scale up = swap the matatu for a bigger bus."
  },
  {
    id: "d1-q09",
    topic: "d1-benefits",
    level: 2,
    q: "Which statement correctly describes reliability and predictability as benefits of the cloud?",
    options: [
      "Reliability means you can forecast your costs; predictability means recovering quickly from failures",
      "Reliability means recovering from failures and continuing to work; predictability means steady performance and forecastable costs",
      "Reliability and predictability both mean the provider guarantees a service will never go down"
    ],
    answer: 1,
    why: "Reliability is about resilience: the cloud's many datacenters and regions help workloads recover from failures and keep running. Predictability has two sides — performance predictability (for example, autoscaling and load balancing keep the user experience steady) and cost predictability (tracking and forecasting what you will spend).",
    wrong: [
      "The definitions are swapped: forecasting costs is part of predictability, and recovering from failures is reliability.",
      null,
      "No cloud promises zero downtime; SLAs promise an uptime percentage, and both benefits are about handling failures and planning, not perfection."
    ],
    tip: "Reliable = the bus still gets you home if a tyre bursts; predictable = you know roughly when it arrives and what the fare will be."
  },
  {
    id: "d1-q10",
    topic: "d1-benefits",
    level: 3,
    q: "A microfinance company in Kampala must make sure every new cloud resource follows its internal standards and national data rules. It wants deployments that break these rules to be flagged or blocked automatically. Which cloud benefit does this describe?",
    options: [
      "Manageability",
      "Elasticity",
      "Predictability",
      "Governance"
    ],
    answer: 3,
    why: "Governance (part of the 'security and governance' benefit) means setting rules and checking that resources follow them. In the cloud you can apply policies and standard templates so deployments stay compliant, and resources that break the rules can be reported or blocked automatically.",
    wrong: [
      "Manageability is about how easily you can control and monitor resources (portal, command line, APIs, automatic alerts), not about enforcing standards.",
      "Elasticity is automatically adding or removing resources as demand changes.",
      "Predictability is about steady performance and being able to forecast costs.",
      null
    ],
    tip: "Governance is the estate's rule book plus the guard at the gate: the rules are written down and checked every time someone comes in."
  },
  {
    id: "d1-q11",
    topic: "d1-benefits",
    level: 1,
    q: "Which of these is an example of manageability as a benefit of the cloud?",
    options: [
      "Controlling resources through a web portal, command line or APIs, and getting alerts when something needs attention",
      "Committing to a three-year reservation to get a lower price",
      "Encrypting data so that only authorised people can read it",
      "Keeping copies of data in a second region in case the first one fails"
    ],
    answer: 0,
    why: "Manageability means the cloud is easy to run and control. You can work through the portal, a command line or APIs, deploy from templates, and let the cloud watch your resources, scale them and send alerts automatically.",
    wrong: [
      null,
      "A reservation is a pricing choice that lowers cost; it isn't about how you manage resources.",
      "Encryption is a security measure, part of the security and governance benefit.",
      "Copying data to another region supports reliability and disaster recovery, not manageability."
    ],
    tip: "Manageability is like paying bills from your phone with mobile money instead of queueing at each office: one place, several tools, instant notifications."
  },
  {
    id: "d1-q12",
    topic: "d1-types",
    level: 1,
    q: "Which cloud service type gives the customer the MOST control over the operating system and the software installed on it?",
    options: [
      "Software as a service (SaaS)",
      "Platform as a service (PaaS)",
      "Infrastructure as a service (IaaS)",
      "Serverless computing"
    ],
    answer: 2,
    why: "IaaS gives you virtual machines, storage and networking. You choose and manage the operating system and everything installed on it, so you get the most control — and also the most responsibility.",
    wrong: [
      "SaaS gives the least control: you just use finished software, and the provider manages everything underneath.",
      "In PaaS the provider manages the OS and runtime, so you focus on your app and data rather than the OS.",
      null,
      "With serverless (such as Azure Functions) you never see or manage the servers or OS; you only supply code."
    ],
    tip: "More control means more chores: IaaS has the most, then PaaS, then SaaS."
  },
  {
    id: "d1-q13",
    topic: "d1-types",
    level: 1,
    q: "Staff at a school in Accra sign in to a web-based email and office suite. They don't run servers or manage updates — they just use the software. Which service type is this?",
    options: [
      "Infrastructure as a service (IaaS)",
      "Software as a service (SaaS)",
      "Platform as a service (PaaS)",
      "Private cloud"
    ],
    answer: 1,
    why: "SaaS delivers complete, ready-to-use software over the internet, usually by subscription. The provider runs the application, platform and infrastructure; the school only looks after its users, data and devices. Microsoft 365 email and office apps are a well-known SaaS example.",
    wrong: [
      "IaaS would mean the school rents virtual machines and installs and manages the OS and software itself.",
      null,
      "PaaS is a managed platform for building and running your own apps; the school isn't developing an app here.",
      "Private cloud is a deployment model (cloud for one organisation only), not a service type like IaaS, PaaS or SaaS."
    ],
    tip: "SaaS is like eating at a hotel: you just order and eat — no cooking, no washing up."
  },
  {
    id: "d1-q14",
    topic: "d1-types",
    level: 2,
    q: "What is the key difference between IaaS and PaaS?",
    options: [
      "In PaaS you manage the operating system; in IaaS the provider manages it for you",
      "IaaS runs in the provider's cloud, while PaaS runs only on your own on-premises servers",
      "IaaS can only be used to store files, while PaaS can only be used to host databases",
      "In IaaS you manage the operating system; in PaaS the provider manages it so you focus on your app"
    ],
    answer: 3,
    why: "Both run on the provider's hardware. With IaaS you get virtual machines and must configure and patch the OS yourself. With PaaS, such as Azure App Service, the provider looks after the OS, patches and runtime, so developers just deploy their code and manage their data.",
    wrong: [
      "This is the wrong way round: the customer manages the OS in IaaS, and the provider manages it in PaaS.",
      "Both IaaS and PaaS are cloud services that run on the provider's infrastructure.",
      "Both are general-purpose: IaaS can run almost any workload on VMs, and PaaS hosts web apps, APIs, databases and more.",
      null
    ],
    tip: "IaaS = renting an empty kitchen; PaaS = renting a kitchen with the cooker, gas and pots ready — you just bring the ingredients (your code)."
  },
  {
    id: "d1-q15",
    topic: "d1-types",
    level: 3,
    q: "A fintech start-up in Lagos wants to publish its new web API quickly. The developers don't want to create VMs, patch operating systems or set up web servers — they just want to deploy their code. Which option fits best?",
    options: [
      "IaaS, using Azure Virtual Machines",
      "SaaS, using Microsoft 365",
      "On-premises servers in their Lagos office",
      "PaaS, using Azure App Service"
    ],
    answer: 3,
    why: "PaaS gives developers a managed platform. Azure App Service hosts web apps and APIs while Azure handles the operating system, patching and web server, so the team only deploys code and manages its data and settings.",
    wrong: [
      "Azure Virtual Machines are IaaS: the team would have to install and patch the OS and web server themselves.",
      "Microsoft 365 is ready-made productivity software (SaaS); you can't host your own API in it.",
      "Running their own servers means buying hardware and doing all the maintenance — the opposite of what they want.",
      null
    ],
    tip: "If the story says 'they just want to deploy their code', think PaaS."
  },
  {
    id: "d1-q16",
    topic: "d1-types",
    level: 2,
    q: "A coffee exporter in Addis Ababa has an old accounting program that only runs on one specific Windows Server version with custom drivers. It wants to move it to Azure with as few changes as possible. Which service type fits best?",
    options: [
      "Infrastructure as a service (IaaS)",
      "Platform as a service (PaaS)",
      "Software as a service (SaaS)",
      "Serverless computing"
    ],
    answer: 0,
    why: "IaaS gives you a virtual machine where you choose the OS version and install whatever the program needs, including custom drivers. That makes it the usual choice for 'lift and shift' moves of older apps with special requirements.",
    wrong: [
      null,
      "PaaS manages the OS for you, so you can't pick an old Windows Server version or install custom drivers.",
      "SaaS means using someone else's finished software, not running your own program.",
      "Serverless runs small pieces of code in response to events; it can't host a full legacy program that needs its own OS setup."
    ],
    tip: "Old app with special needs? Move the whole house as it is — that's IaaS."
  }
]);
