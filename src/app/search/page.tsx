export default function search() {
	const mockData = [
		{
			id: 1,
			name: "Bow",
		},
		{
			id: 2,
			name: "Jay",
		},
		{
			id: 3,
			name: "Faii",
		},
		{
			id: 4,
			name: "Win",
		},
	];
	return (
		<div className="flex flex-row bg-#0F1130">
			<div className="flex flex-col">
				<div className="text-white"> Online User</div>
				<div className="text-#94A3B8"> Click to chat with online User</div>
				{mockData.map((data) => {
					return (
						<div key={data.id} className="text-white">
							{data.name}
						</div>
					);
				})}
			</div>
			<div className="flex flex-col">
				<div className="flex flex-">Global Group</div>
			</div>
		</div>
	);
}
