window.IMEI_DATA = {
  devices: [
    { imei: '353456789012345', model: 'Galaxy A25 5G', brand: 'Samsung', state: 'Sold', sources: 4, last: '2026-10-02' },
    { imei: '357891234567890', model: 'Redmi Note 13', brand: 'Xiaomi', state: 'In transit', sources: 3, last: '2026-10-05' },
    { imei: '351234567890123', model: 'Infinix Hot 40', brand: 'Infinix', state: 'Received', sources: 2, last: '2026-09-28' },
    { imei: '359012345678901', model: 'HONOR 200 Lite', brand: 'Honor', state: 'Review', sources: 4, last: '2026-10-04' },
    { imei: '358765432109876', model: 'Nokia G42 5G', brand: 'Nokia', state: 'Sold', sources: 3, last: '2026-09-30' },
    { imei: '352233445566778', model: 'Galaxy M15', brand: 'Samsung', state: 'Bad bin', sources: 2, last: '2026-10-01' },
    { imei: '354455667788990', model: 'Redmi 14C', brand: 'Xiaomi', state: 'Never classified', sources: 1, last: '—' },
    { imei: '355566778899001', model: 'HONOR X9b', brand: 'Honor', state: 'In transit', sources: 3, last: '2026-10-06' },
    { imei: '356677889900112', model: 'Infinix Note 40', brand: 'Infinix', state: 'Received', sources: 2, last: '2026-10-03' },
    { imei: '357788990011223', model: 'Nokia C39', brand: 'Nokia', state: 'No terminal state', sources: 2, last: '2026-09-22' },
    { imei: '358899001122334', model: 'Galaxy A15', brand: 'Samsung', state: 'Sold', sources: 4, last: '2026-10-05' },
    { imei: '359900112233445', model: 'Redmi 14C', brand: 'Brand conflict', state: 'Review', sources: 3, last: '2026-10-04' }
  ],
  occurrences: [
    { when: '2026-09-22', imei: '357788990011223', tab: 'Source 1', state: 'Received', product: 'Nokia C39', note: 'Undated scan' },
    { when: '2026-09-28', imei: '351234567890123', tab: 'Source 2', state: 'Received', product: 'Infinix Hot 40', note: 'Dhaka hub' },
    { when: '2026-09-30', imei: '358765432109876', tab: 'Source 1', state: 'Sold', product: 'Nokia G42 5G', note: 'Invoice INV-2210' },
    { when: '2026-10-01', imei: '352233445566778', tab: 'Source 3', state: 'Bad bin', product: 'Galaxy M15', note: 'Screen issue' },
    { when: '2026-10-02', imei: '353456789012345', tab: 'Source 1', state: 'Sold', product: 'Galaxy A25 5G', note: 'Invoice INV-2214' },
    { when: '2026-10-03', imei: '356677889900112', tab: 'Source 2', state: 'Received', product: 'Infinix Note 40', note: 'Sylhet depot' },
    { when: '2026-10-04', imei: '359012345678901', tab: 'Source 2', state: 'Review', product: 'HONOR 200 Lite', note: 'Serial mismatch' },
    { when: '2026-10-04', imei: '359900112233445', tab: 'Source 3', state: 'Sold', product: 'Redmi 14C (Conflict)', note: 'Brand disagrees with Source 1' },
    { when: '2026-10-05', imei: '357891234567890', tab: 'Source 3', state: 'In transit', product: 'Redmi Note 13', note: 'TR-92841' },
    { when: '2026-10-05', imei: '358899001122334', tab: 'Source 1', state: 'Sold', product: 'Galaxy A15', note: 'Invoice INV-2218' },
    { when: '2026-10-06', imei: '355566778899001', tab: 'Source 4', state: 'In transit', product: 'HONOR X9b', note: 'TR-92836' }
  ],
  conflicts: [
    { imei: '359900112233445', issue: 'Brand conflict — Source 1 says Xiaomi, Source 3 says unknown', sources: 'S1 · S3', severity: 'High', status: 'Open' },
    { imei: '359012345678901', issue: 'Serial number mismatch between Source 2 and Source 4', sources: 'S2 · S4', severity: 'High', status: 'Open' },
    { imei: '357788990011223', issue: 'No terminal state in any source past 2026-09-22', sources: 'S1 · S2', severity: 'Medium', status: 'Open' },
    { imei: '354455667788990', issue: 'Never classified at source — no product string', sources: 'S1', severity: 'Low', status: 'Open' },
    { imei: '352233445566778', issue: 'State rolled back — Source 3 says Bad bin, Source 1 says Received', sources: 'S1 · S3', severity: 'Medium', status: 'Open' },
    { imei: '358899001122334', issue: 'Duplicate occurrence in Source 4 (same timestamp)', sources: 'S1 · S4', severity: 'Low', status: 'Rejected' }
  ]
};
