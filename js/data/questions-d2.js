// Readyfor900 — ORIGINAL practice questions written for this app. Unofficial; not affiliated with or endorsed by Microsoft.
// Domain: Describe Azure architecture and services (35–40%)
window.READY = window.READY || {};
READY.questions = (READY.questions || []).concat([
  // ---------- d2-core: core architecture ----------
  {
    id: "d2-q01",
    topic: "d2-core",
    level: 1,
    q: "What is an Azure availability zone?",
    options: [
      "A pair of Azure regions in the same geography that back each other up",
      "A separate, isolated instance of Azure built to meet a government's legal requirements",
      "A physically separate location inside an Azure region, with its own power, cooling and networking",
      "A logical folder that holds related Azure resources so you can manage them together"
    ],
    answer: 2,
    why: "Availability zones are physically separate locations within one region, and each zone is made up of one or more datacenters with independent power, cooling and networking. Not every region has zones, but those that do have at least three, so if one zone fails the others keep running.",
    wrong: [
      "That is a region pair: two regions in the same geography, usually far apart, that support each other for disaster recovery.",
      "That is a sovereign region, such as Azure Government in the US.",
      null,
      "That is a resource group, which is a logical container, not a physical location."
    ],
    tip: "Think of a region as a city and its zones as separate estates, each with its own power line and water supply: a blackout in one estate doesn't darken the others."
  },
  {
    id: "d2-q02",
    topic: "d2-core",
    level: 2,
    q: "What makes a sovereign region different from a regular Azure region?",
    options: [
      "It is a separate instance of Azure, isolated from the main public cloud to meet strict legal or compliance needs",
      "It is any Azure region located inside your own country",
      "It is a region that has at least three availability zones",
      "It is the secondary region of a region pair, used only for backups"
    ],
    answer: 0,
    why: "Sovereign regions are instances of Azure kept isolated from the main public Azure cloud for compliance or legal reasons. Examples are Azure Government (for US government agencies) and Azure in China, operated by 21Vianet.",
    wrong: [
      null,
      "A region in your own country is still a normal public region; for example, South Africa North is a regular Azure region, not a sovereign one.",
      "That describes a region that supports availability zones; zones are about resilience, not legal isolation.",
      "Both regions in a pair are regular Azure regions; being part of a pair doesn't make a region sovereign."
    ],
    tip: "Sovereign means 'a walled-off Azure of its own': remember Azure Government (US) and Azure in China run by 21Vianet."
  },
  {
    id: "d2-q03",
    topic: "d2-core",
    level: 3,
    q: "A Johannesburg retailer runs its online shop in the South Africa North region. It wants a copy of its data that would survive a disaster affecting the whole region, and it wants to use Azure's region pairing. Where should that copy live?",
    options: [
      "In a different datacenter within South Africa North",
      "In the West Europe region",
      "In a separate resource group in the same subscription",
      "In the South Africa West region (Cape Town)"
    ],
    answer: 3,
    why: "South Africa North (Johannesburg) and South Africa West (Cape Town) are a region pair. Paired regions sit in the same geography but far apart, so one disaster is unlikely to hit both, and Azure rolls out planned updates to only one region of a pair at a time.",
    wrong: [
      "Datacenters in the same region can all be hit by a region-wide disaster, and you don't pick individual datacenters anyway.",
      "West Europe is a real Azure region, but it isn't South Africa North's pair, so it wouldn't give the region-pair benefits.",
      "A resource group is a logical folder, not a location; its resources still run in whatever region you chose.",
      null
    ],
    tip: "Like keeping a spare house key with a relative in another city: if trouble hits Johannesburg, the copy in Cape Town is safe."
  },
  {
    id: "d2-q04",
    topic: "d2-core",
    level: 1,
    q: "Which statement about Azure resource groups is true?",
    options: [
      "A resource group can be placed inside another resource group",
      "Each resource belongs to only one resource group at a time",
      "Deleting a resource group leaves its resources running on their own",
      "Once a resource is created, it can never move to a different resource group"
    ],
    answer: 1,
    why: "A resource group is a logical container for resources that share a lifecycle. Every resource lives in exactly one resource group, though you can move it to another group later.",
    wrong: [
      "Resource groups cannot be nested; they sit side by side inside a subscription.",
      null,
      "Deleting a resource group deletes every resource inside it, so be careful.",
      "Resources can be moved from one resource group to another when your needs change."
    ],
    tip: "A resource group is like a school-fees envelope for one child: each note goes into one envelope only, and if you throw the envelope away, everything inside goes with it."
  },
  {
    id: "d2-q05",
    topic: "d2-core",
    level: 1,
    q: "Which list shows the Azure organising hierarchy from the top level down?",
    options: [
      "Subscriptions → management groups → resource groups → resources",
      "Management groups → resource groups → subscriptions → resources",
      "Management groups → subscriptions → resource groups → resources",
      "Resource groups → subscriptions → management groups → resources"
    ],
    answer: 2,
    why: "Management groups organise subscriptions, subscriptions contain resource groups, and resource groups contain resources. Settings such as RBAC roles and Azure Policy assigned at a higher level are inherited by everything below it. Management groups can be nested up to six levels deep, not counting the root.",
    wrong: [
      "Management groups sit above subscriptions; their whole job is to organise subscriptions.",
      "Resource groups live inside a subscription, not the other way round.",
      null,
      "This is upside down: resource groups sit near the bottom, just above resources."
    ],
    tip: "Think country → county → ward → household: a rule made at county level applies to every household below it."
  },
  {
    id: "d2-q06",
    topic: "d2-core",
    level: 1,
    q: "Which level of the Azure hierarchy acts as both a billing boundary and an access-control boundary?",
    options: [
      "Resource group",
      "Availability zone",
      "Management group",
      "Subscription"
    ],
    answer: 3,
    why: "A subscription is a billing boundary, because usage is tracked and billed per subscription, and an access boundary, because you control who can manage the resources inside it. Organisations often create separate subscriptions for different departments, environments or projects.",
    wrong: [
      "You can control access at a resource group, but it is a container inside a subscription, and billing happens at the subscription level.",
      "An availability zone is a physical location inside a region; it has nothing to do with billing or access.",
      "Management groups organise subscriptions so you can apply policy and access at scale, but usage isn't billed at the management group.",
      null
    ],
    tip: "A subscription is like a separate prepaid electricity meter for each house: each one tracks its own spending, and only people you allow can manage it."
  },

  // ---------- d2-compute: compute and networking ----------
  {
    id: "d2-q07",
    topic: "d2-compute",
    level: 2,
    q: "A small app must resize each photo the moment it is uploaded. Each job takes a few seconds, and the app is idle most of the day. The team doesn't want to manage any servers and wants to pay only when the code runs. Which compute option fits best?",
    options: [
      "Azure Functions",
      "Azure Virtual Machines",
      "Azure Container Instances"
    ],
    answer: 0,
    why: "Azure Functions is serverless and event-driven: your code runs when something happens, like a file upload, and on the consumption plan you pay only while it runs. Quick compare: a VM virtualises hardware and gives you a full OS to manage, a container packages an app with its dependencies and is lighter and quicker to start, and a function is just your code reacting to events.",
    wrong: [
      null,
      "A VM gives you a full operating system to manage and patch, and you pay for it while it is running, even when it sits idle.",
      "Container Instances runs a container image you build and look after, billed while it runs; it doesn't fire automatically on each upload the way Functions does."
    ],
    tip: "VM = renting a whole house, container = renting a furnished room, function = paying a boda boda per ride only when you need to move."
  },
  {
    id: "d2-q08",
    topic: "d2-compute",
    level: 2,
    q: "What is the key difference between a virtual machine scale set and an availability set?",
    options: [
      "An availability set adds or removes VMs automatically as demand changes; a scale set only spreads VMs across server racks",
      "A scale set can automatically add or remove identical VMs as demand changes; an availability set spreads VMs across fault and update domains to survive hardware failures and maintenance",
      "A scale set makes one VM bigger when demand rises; an availability set makes VMs cheaper by sharing hardware"
    ],
    answer: 1,
    why: "Scale sets give you identical, load-balanced VMs that can scale out and in automatically. Availability sets protect the VMs you put in them: fault domains (up to 3) separate VMs across power and network racks, and update domains (up to 20, default 5) make sure only one group is rebooted at a time during planned maintenance.",
    wrong: [
      "This has them the wrong way round: scale sets autoscale, availability sets don't.",
      null,
      "Making one VM bigger is vertical scaling (scale up); scale sets scale out by adding more VMs, and availability sets are about resilience, not saving money."
    ],
    tip: "Scale set = adding more matatus at rush hour; availability set = parking your matatus in different garages so one fire can't take them all."
  },
  {
    id: "d2-q09",
    topic: "d2-compute",
    level: 1,
    q: "Which Azure service delivers full Windows desktops and apps from the cloud, so users can work from almost any device?",
    options: [
      "Azure Virtual Machine Scale Sets",
      "Azure App Service",
      "Azure Functions",
      "Azure Virtual Desktop"
    ],
    answer: 3,
    why: "Azure Virtual Desktop is desktop and app virtualisation that runs in the cloud. Users connect to their desktop and apps from a laptop, tablet or phone, and because everything runs in Azure, company data doesn't have to be stored on the device itself.",
    wrong: [
      "Scale sets run groups of identical VMs that scale with demand; they don't hand out desktops to users.",
      "App Service hosts web apps and APIs, not full desktops.",
      "Azure Functions runs small pieces of event-driven code, not desktops.",
      null
    ],
    tip: "Like a cyber café computer that follows you home: the desktop lives in Azure, and any device you own becomes the screen."
  },
  {
    id: "d2-q10",
    topic: "d2-compute",
    level: 1,
    q: "You are creating a virtual machine in Azure. Which networking pieces does every VM need?",
    options: [
      "A VPN Gateway and an ExpressRoute circuit",
      "A public IP address and an Azure DNS zone",
      "A virtual network with a subnet, and a network interface",
      "A peering connection to another virtual network"
    ],
    answer: 2,
    why: "Every VM sits in a subnet of a virtual network (VNet) and connects to it through a network interface. Together with a size and disks, these are the core resources a VM needs; a public IP address and a network security group are optional extras.",
    wrong: [
      "These connect an on-premises network to Azure; a VM doesn't need them to run.",
      "A public IP is optional (only if the VM must be reached directly from the internet), and Azure DNS is for hosting your domain's DNS records.",
      null,
      "Peering connects two virtual networks; a VM in a single VNet doesn't need it."
    ],
    tip: "VNet = the estate, subnet = one street in the estate, network interface = the gate that connects a house to that street."
  },
  {
    id: "d2-q11",
    topic: "d2-compute",
    level: 2,
    q: "A Lagos fintech wants to host its customer website and REST API without managing operating systems or a container cluster. It wants built-in scaling and easy deployments. Which hosting option fits best?",
    options: [
      "Azure App Service",
      "Azure Virtual Machines",
      "Azure Kubernetes Service (AKS)",
      "Azure Virtual Desktop"
    ],
    answer: 0,
    why: "Azure App Service is a platform as a service (PaaS) for hosting web apps and APIs. Azure manages the operating system and infrastructure, so the team focuses on its code and simple settings for scaling and deployment.",
    wrong: [
      null,
      "VMs give full control, but the team would have to patch and manage the operating system itself (IaaS).",
      "AKS orchestrates many containers at scale, but the team would take on designing and running a Kubernetes cluster.",
      "Azure Virtual Desktop delivers desktops to users; it doesn't host websites or APIs."
    ],
    tip: "App Service is like hiring a caterer for a wedding: you choose the menu (your code), and they run the kitchen (servers and OS)."
  },
  {
    id: "d2-q12",
    topic: "d2-compute",
    level: 3,
    q: "A Nairobi bank must connect its head-office datacenter to Azure. Its security team insists the traffic must not travel over the public internet at all, and the link must be reliable and high-bandwidth. What should the bank use?",
    options: [
      "A site-to-site VPN Gateway connection",
      "Azure ExpressRoute",
      "Virtual network peering",
      "A private endpoint"
    ],
    answer: 1,
    why: "ExpressRoute is a private connection from your network into Azure through a connectivity provider, so traffic does not cross the public internet, and it is built for reliable, high-bandwidth links. Remember that private is not the same as encrypted: ExpressRoute traffic is not encrypted by default.",
    wrong: [
      "A VPN Gateway encrypts traffic, but that traffic still travels across the public internet.",
      null,
      "Peering connects Azure virtual networks to each other, not an on-premises datacenter to Azure.",
      "A private endpoint gives an Azure service a private IP inside your VNet; on its own it doesn't link your office datacenter to Azure."
    ],
    tip: "VPN = an armoured van on the public highway; ExpressRoute = a private road that the public can't drive on."
  },
  {
    id: "d2-q13",
    topic: "d2-compute",
    level: 1,
    q: "What does a private endpoint do for an Azure service such as a storage account?",
    options: [
      "It gives the service a public IP address so anyone on the internet can reach it",
      "It connects two virtual networks so their resources can talk to each other",
      "It hosts the DNS records for your organisation's domain name",
      "It gives the service a private IP address from your virtual network, so your resources reach it without using the public internet"
    ],
    answer: 3,
    why: "A private endpoint (part of Azure Private Link) puts a network interface with a private IP from your VNet in front of the service. Your apps reach the service privately instead of through its public endpoint, and you can then turn off public access.",
    wrong: [
      "That describes a public endpoint, which is reachable over the internet.",
      "That is virtual network peering, which links VNets over Microsoft's backbone network.",
      "That is Azure DNS, which hosts DNS zones; note that you can't buy domain names through Azure DNS.",
      null
    ],
    tip: "Public endpoint = a shop's front door on the main road; private endpoint = a door that opens only from inside your own estate."
  },

  // ---------- d2-storage: storage ----------
  {
    id: "d2-q14",
    topic: "d2-storage",
    level: 2,
    q: "Several Windows VMs need to map the same network drive over SMB so staff can share documents. Which Azure Storage service fits?",
    options: [
      "Azure Blob Storage",
      "Azure Queue Storage",
      "Azure Files",
      "Azure Table Storage"
    ],
    answer: 2,
    why: "Azure Files provides fully managed file shares in the cloud that machines can mount over SMB (or NFS), just like a shared drive in an office.",
    wrong: [
      "Blob Storage is for unstructured objects like images, videos and backups, mainly reached over HTTP/HTTPS, not a mapped SMB drive.",
      "Queue Storage holds messages that let different parts of an application pass work to each other.",
      null,
      "Table Storage holds structured NoSQL data as keys and attributes, not shared files."
    ],
    tip: "Files = the shared office cabinet, Blob = a big godown for any kind of item, Queue = the pile of order slips, Table = a simple ledger."
  },
  {
    id: "d2-q15",
    topic: "d2-storage",
    level: 3,
    q: "A Nairobi school must keep scanned exam records for seven years. Nobody expects to open them, and if someone ever does, waiting several hours is fine. The goal is the lowest possible storage cost. Which blob access tier fits?",
    options: [
      "Hot",
      "Cool",
      "Cold",
      "Archive"
    ],
    answer: 3,
    why: "Archive is the cheapest tier for storing data you rarely read and will keep for at least 180 days. It is offline, so a blob must be rehydrated to an online tier before it can be read, which can take hours; that is fine for this school.",
    wrong: [
      "Hot is for data you read often; it has the highest storage cost and the lowest access cost.",
      "Cool is for infrequently used data kept at least 30 days; it stays online but costs more to store than Archive.",
      "Cold is for rarely used data kept at least 90 days and stays online for quick reads, but storing data there still costs more than Archive.",
      null
    ],
    tip: "Archive is like grain sealed in the village store after harvest: cheapest to keep, but slow to bring back out."
  },
  {
    id: "d2-q16",
    topic: "d2-storage",
    level: 2,
    q: "Which redundancy option keeps three copies of your data in one datacenter in the primary region and also copies it to the paired secondary region?",
    options: [
      "Locally redundant storage (LRS)",
      "Geo-redundant storage (GRS)",
      "Zone-redundant storage (ZRS)",
      "Geo-zone-redundant storage (GZRS)"
    ],
    answer: 1,
    why: "GRS stores three copies in one datacenter in the primary region (like LRS), then copies the data asynchronously to the secondary region, so it can survive a region-wide outage. Choose RA-GRS if you also want to read from the secondary region at any time.",
    wrong: [
      "LRS keeps three copies in a single datacenter only, with nothing in another region.",
      null,
      "ZRS spreads three copies across three availability zones in the primary region, but keeps no copy in another region.",
      "GZRS also copies to the secondary region, but in the primary region it spreads the copies across availability zones instead of one datacenter."
    ],
    tip: "L = Local (one building), Z = Zones (three estates in one city), G = Geo (another city too), GZ = zones plus another city."
  },
  {
    id: "d2-q17",
    topic: "d2-storage",
    level: 1,
    q: "A startup wants one storage account that can hold blobs, file shares, queues and tables, with standard performance. Which storage account type is recommended for most scenarios like this?",
    options: [
      "Standard general-purpose v2",
      "Premium block blobs",
      "Premium file shares",
      "Premium page blobs"
    ],
    answer: 0,
    why: "Standard general-purpose v2 supports Blob Storage, Azure Files, Queue Storage and Table Storage, and it is the recommended choice for most scenarios. The premium types use faster SSD-based storage, but each one focuses on a single kind of data.",
    wrong: [
      null,
      "Premium block blobs is for block and append blobs that need fast, low-latency access; it can't hold file shares, queues or tables.",
      "Premium file shares is only for Azure Files shares that need high performance.",
      "Premium page blobs is only for page blobs, the random-access format behind things like VM disks."
    ],
    tip: "General-purpose v2 is the duka that sells a bit of everything: start there unless you have a clear reason to go premium."
  },
  {
    id: "d2-q18",
    topic: "d2-storage",
    level: 3,
    q: "A TV station in Dar es Salaam wants to move 80 TB of archived video into Azure Blob Storage. Its internet link is slow and expensive, so uploading would take months. What is the best option?",
    options: [
      "Copy the files with AzCopy over the internet",
      "Use Azure File Sync to sync the files to Azure Files",
      "Order an Azure Data Box, load the data locally and ship the device back to Microsoft",
      "Use Azure Migrate to assess and migrate the station's servers"
    ],
    answer: 2,
    why: "Azure Data Box is a physical device Microsoft ships to you. You copy the data onto it locally and send it back, and Microsoft uploads it into your storage account, which is ideal when the network is too slow or costly for a large transfer.",
    wrong: [
      "AzCopy is a command-line copy tool (Azure Storage Explorer is its free graphical cousin); both send data over the network, so the slow link is still the bottleneck.",
      "Azure File Sync keeps a Windows file server in sync with Azure Files; it still depends on the network and targets file shares, not Blob Storage.",
      null,
      "Azure Migrate is the hub for discovering, assessing and migrating on-premises servers, apps and databases; assessing servers doesn't solve moving 80 TB of files over a slow link."
    ],
    tip: "When the road (your network) is too narrow, put the goods on a lorry: Data Box is Azure's lorry for your data."
  },

  // ---------- d2-identity: identity, access and security ----------
  {
    id: "d2-q19",
    topic: "d2-identity",
    level: 3,
    q: "An Accra company is moving an old payroll app to Azure VMs. The app needs traditional domain join, Group Policy and Kerberos authentication, but the IT team doesn't want to deploy and patch its own domain controllers. Which service fits?",
    options: [
      "Microsoft Entra ID on its own",
      "Microsoft Entra Domain Services",
      "Microsoft Entra External ID",
      "Azure role-based access control (RBAC)"
    ],
    answer: 1,
    why: "Microsoft Entra Domain Services provides managed domain services such as domain join, Group Policy, LDAP and Kerberos/NTLM authentication, without you running domain controllers. Microsoft deploys and maintains them for you.",
    wrong: [
      "Entra ID is the cloud identity service for sign-in, SSO and MFA to cloud apps, but on its own it doesn't give legacy apps traditional domain join, Group Policy or Kerberos.",
      null,
      "External ID lets partners and customers sign in to your apps with their own identities; it doesn't provide domain services.",
      "Azure RBAC controls who can manage Azure resources; it doesn't provide domain services to VMs."
    ],
    tip: "Entra Domain Services is like an estate office that comes fully staffed: you get the caretaker's services without hiring and managing a caretaker yourself."
  },
  {
    id: "d2-q20",
    topic: "d2-identity",
    level: 1,
    q: "Which sign-in is an example of multi-factor authentication (MFA)?",
    options: [
      "A password plus the answer to a secret question",
      "A long password that must be changed every month",
      "Signing in once and then opening email, HR and payroll apps without signing in again",
      "A password plus a code from the Microsoft Authenticator app on your phone"
    ],
    answer: 3,
    why: "MFA combines two or more different kinds of proof: something you know (a password), something you have (your phone) and something you are (a fingerprint or face). A password plus an Authenticator code is 'know' plus 'have'. Passwordless methods such as Windows Hello for Business, the Authenticator app and FIDO2 security keys go a step further and remove the password altogether.",
    wrong: [
      "A password and a secret answer are both 'something you know', so that is one type of factor used twice.",
      "One strong password is still just a single factor.",
      "That is single sign-on (SSO): one identity for many apps. It is convenient, but it doesn't add a second factor.",
      null
    ],
    tip: "MFA is like sending mobile money: you need your phone (something you have) and your PIN (something you know)."
  },
  {
    id: "d2-q21",
    topic: "d2-identity",
    level: 1,
    q: "Which Microsoft Entra capability lets people from partner organisations, or customers, sign in to your apps using their own existing identities?",
    options: [
      "External identities (Microsoft Entra External ID)",
      "Microsoft Entra Domain Services",
      "Conditional Access",
      "Azure role-based access control (RBAC)"
    ],
    answer: 0,
    why: "External identities let people outside your organisation, such as partners, suppliers and customers, use their own work, school or social accounts to reach your apps. With B2B collaboration, a partner signs in with their own credentials, so you don't manage passwords for them.",
    wrong: [
      null,
      "Entra Domain Services provides managed domain join, Group Policy, LDAP and Kerberos for your own servers.",
      "Conditional Access decides whether to allow, block or require MFA based on signals; it doesn't give outsiders a way to sign in with their own identity.",
      "RBAC controls what a signed-in identity can do to Azure resources, not how outsiders sign in."
    ],
    tip: "Like an estate gate that accepts a visitor's own national ID instead of printing a new card: guests bring their own identity, and you decide where they may go."
  },
  {
    id: "d2-q22",
    topic: "d2-identity",
    level: 3,
    q: "A clinic in Kigali wants doctors to sign in normally on the clinic network, to be asked for MFA when they sign in from anywhere else, and to be blocked when a sign-in looks high-risk. Which feature should the clinic configure?",
    options: [
      "Azure role-based access control (RBAC)",
      "Microsoft Defender for Cloud",
      "Conditional Access",
      "Single sign-on (SSO)"
    ],
    answer: 2,
    why: "Conditional Access looks at signals such as who is signing in, from where, on what device and how risky the sign-in looks, then decides to allow it, require MFA or block it. It is a practical way to apply the Zero Trust principle of 'verify explicitly'.",
    wrong: [
      "RBAC decides what a signed-in user can do to Azure resources; it doesn't check location or risk at sign-in.",
      "Defender for Cloud manages security posture and threat protection for your workloads; it doesn't make sign-in decisions.",
      null,
      "SSO lets users sign in once for many apps; it doesn't add conditions based on location or risk."
    ],
    tip: "Conditional Access is the estate guard who waves in residents he knows, asks strangers for ID, and turns away anyone suspicious."
  },
  {
    id: "d2-q23",
    topic: "d2-identity",
    level: 2,
    q: "An auditor at a Nairobi school must be able to view the resources in one resource group, without changing anything and without seeing other resource groups. Following least privilege, what should you assign?",
    options: [
      "The Contributor role at the resource group scope",
      "The Reader role at the resource group scope",
      "The Reader role at the subscription scope",
      "An Azure Policy assignment on the resource group"
    ],
    answer: 1,
    why: "Azure RBAC assigns a role to a user, group or app at a scope. Reader lets someone view but not change, and assigning it on just that resource group keeps access as small as possible. This is least privilege, one of the three Zero Trust principles alongside 'verify explicitly' and 'assume breach'.",
    wrong: [
      "Contributor can create, change and delete resources, which is far more than viewing.",
      null,
      "Reader at the subscription scope is inherited by every resource group in the subscription, so the auditor would see too much.",
      "Azure Policy enforces rules on resource settings (like allowed regions); it doesn't grant people permissions, which is RBAC's job."
    ],
    tip: "RBAC is like giving the caretaker a key to one flat only: the right person, the right role, the right door."
  },
  {
    id: "d2-q24",
    topic: "d2-identity",
    level: 2,
    q: "Which statement about security in Azure is correct?",
    options: [
      "In defense in depth, data sits at the centre, protected by outer layers such as physical security, identity and access, network and application security",
      "Zero Trust treats any device that is already on the company network as trusted",
      "Microsoft Defender for Cloud only protects resources that run inside Azure",
      "Defense in depth relies on one strong firewall at the network perimeter"
    ],
    answer: 0,
    why: "Defense in depth stacks several layers of protection: physical security, identity and access, perimeter, network, compute, application, and data at the centre. If one layer is breached, the next one still slows the attacker down.",
    wrong: [
      null,
      "Zero Trust trusts nothing by default: verify explicitly, use least privilege access and assume breach, even inside the company network.",
      "Defender for Cloud protects workloads across Azure, on-premises and other clouds, giving a secure score and security recommendations.",
      "Defense in depth deliberately avoids depending on one control; a perimeter firewall is just one of many layers."
    ],
    tip: "Defense in depth is like a home with a gate, a guard, a locked door and a safe inside: the money (your data) sits at the very centre."
  }
]);
