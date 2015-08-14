require! 'os'

for ifname,ifaces of os.networkInterfaces()
  alias = 0
  for iface in ifaces
    #console.log iface
    if 'IPv4' != iface.family or iface.internal != false
      # skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      continue
    if alias >= 1
      # this single interface has multiple ipv4 addresses
      console.log "#{ifname}:#{alias} #{iface.address}"
    else
      # this interface has only one ipv4 address
      console.log "#{ifname} #{iface.address}"
    alias++
