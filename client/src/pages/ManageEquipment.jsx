import { useState } from "react";
import { Boxes, Plus, Search, Trash2, Edit, CheckCircle2, Wrench, X } from "lucide-react";
import toast from "react-hot-toast";
import { getEquipmentList, addEquipmentItem, saveEquipmentList } from "../lib/mockData";
import GlowButton from "../components/ui/GlowButton";
import PageTransition from "../components/ui/PageTransition";

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState(getEquipmentList());
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Equipment Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Measurement");
  const [department, setDepartment] = useState("Electronics & Communication");
  const [lab, setLab] = useState("");
  const [totalUnits, setTotalUnits] = useState(5);
  const [specsText, setSpecsText] = useState("");

  const filtered = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(search.toLowerCase()) ||
    eq.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !lab.trim()) {
      toast.error("Please complete the equipment details.");
      return;
    }

    const newItem = addEquipmentItem({
      name,
      category,
      department,
      lab,
      totalUnits: Number(totalUnits),
      specs: specsText.split(",").map((s) => s.trim()).filter(Boolean),
      tags: [category, department.split(" ")[0]],
    });

    setEquipment(getEquipmentList());
    setShowAddModal(false);
    setName("");
    setLab("");
    setSpecsText("");
    toast.success(`Instrument ${newItem.name} registered to campus inventory!`, { icon: "📦" });
  };

  const handleDelete = (id) => {
    const updated = equipment.filter((e) => e.id !== id);
    setEquipment(updated);
    saveEquipmentList(updated);
    toast.success("Equipment item removed.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge-cyan">Lab Manager Console</span>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl">
              Manage Laboratory <span className="text-gradient">Equipment</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Add new campus assets, adjust stock availability, schedule maintenance calibrations.
            </p>
          </div>
          <GlowButton onClick={() => setShowAddModal(true)} className="py-2.5 text-xs flex items-center gap-2">
            <Plus size={16} /> Add Equipment
          </GlowButton>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search equipment by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {/* Inventory Table / Cards */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-white/5 hover:border-cyan-glow/30 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-cyan text-[10px]">{item.category}</span>
                  <span className="text-xs text-white/50">{item.department}</span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-white/50">{item.lab}</p>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <div className="text-right">
                  <div className="text-xs font-semibold text-cyan-glow">
                    {item.availableUnits} / {item.totalUnits} Units
                  </div>
                  <span className="text-[10px] text-emerald-400">Calibrated & Ready</span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl p-2 text-white/40 hover:bg-rose-500/20 hover:text-rose-400 transition"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass p-6 max-w-lg w-full border-cyan-glow/40 shadow-cyan">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-semibold text-white text-base">Register New Lab Instrument</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-white/70">Equipment / Instrument Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohde & Schwarz Spectrum Analyzer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/70">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field mt-1"
                  >
                    <option value="Measurement" className="bg-[#101A35]">Measurement</option>
                    <option value="Prototyping" className="bg-[#101A35]">Prototyping</option>
                    <option value="AI & Computing" className="bg-[#101A35]">AI & Computing</option>
                    <option value="Microscopy" className="bg-[#101A35]">Microscopy</option>
                    <option value="Spectroscopy" className="bg-[#101A35]">Spectroscopy</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/70">Total Units</label>
                  <input
                    type="number"
                    min="1"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    className="input-field mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/70">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70">Lab Location Room</label>
                <input
                  type="text"
                  placeholder="e.g. Robotics Center, Room 402"
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70">Key Specifications (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 100MHz, Dual Channel, USB interface"
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <GlowButton type="submit" className="py-2 text-xs">
                  Save & Register
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
