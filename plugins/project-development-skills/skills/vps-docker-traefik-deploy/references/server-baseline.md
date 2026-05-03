# Server Baseline

## Recommended Host

- Ubuntu LTS 24.04 or Debian stable
- 4 vCPU / 8 GB RAM / 80 GB SSD as a reasonable starting point for small production stacks
- add swap unless you have a deliberate no-swap policy

As of `2026-04-21`, official stable references show:

- Docker Engine on Ubuntu 24.04: `29.4.0`
- Docker Compose plugin latest release: `5.1.3`
- Traefik latest active-support minor: `3.6`

Re-check official release channels before provisioning a new production host.

## Initial Packages

```bash
sudo apt update
sudo apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  jq \
  unzip \
  git \
  ufw \
  fail2ban \
  htop \
  ncdu \
  rsync
```

## Non-Root Operator

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG sudo deploy
```

Important:

- avoid day-to-day root logins
- the `docker` group is root-equivalent; add users there only if you accept that tradeoff

## SSH Hardening

Prefer:

- SSH keys only
- `PermitRootLogin no`
- `PasswordAuthentication no`
- restricted `AllowUsers`

Example:

```bash
sudo sed -i 's/^#\\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

## Swap

Example `4 GB` swapfile:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf
sudo sysctl --system
```

## Docker Install

Use Docker's official apt repository:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify:

```bash
docker version
docker compose version
```

## Firewall

Default public ports:

- `22/tcp`
- `80/tcp`
- `443/tcp`

Example:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Only add more ports if the app genuinely requires them.
