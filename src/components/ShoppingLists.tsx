import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "../hooks/use-toast";
import { Id } from "../../convex/_generated/dataModel";

export function ShoppingLists() {
  const { toast } = useToast();
  const lists = useQuery(api.shoppingLists.getLists) || [];
  const createList = useMutation(api.shoppingLists.createList);
  const deleteList = useMutation(api.shoppingLists.deleteList);
  
  const [newListName, setNewListName] = useState("");
  const [newListBudget, setNewListBudget] = useState("");
  const [selectedList, setSelectedList] = useState<Id<"shoppingLists"> | null>(null);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName || !newListBudget) {
      toast({
        title: "Hata",
        description: "Liste adı ve bütçe gereklidir",
        variant: "destructive",
      });
      return;
    }

    try {
      await createList({
        name: newListName,
        budget: parseFloat(newListBudget),
      });
      setNewListName("");
      setNewListBudget("");
      toast({
        title: "Başarılı",
        description: "Liste oluşturuldu",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Liste oluşturulamadı",
        variant: "destructive",
      });
    }
  };

  const handleDeleteList = async (listId: Id<"shoppingLists">) => {
    try {
      await deleteList({ listId });
      toast({
        title: "Başarılı",
        description: "Liste silindi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Liste silinemedi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreateList} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-800 rounded-lg">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Liste Adı"
          className="flex-1 px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400"
        />
        <div className="flex gap-3">
          <input
            type="number"
            value={newListBudget}
            onChange={(e) => setNewListBudget(e.target.value)}
            placeholder="Bütçe"
            className="w-full sm:w-32 px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors whitespace-nowrap"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="grid gap-4 grid-cols-1">
        {lists.map((list) => (
          <div
            key={list._id}
            className="p-4 bg-gray-800 rounded-lg flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{list.name}</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-400 text-sm">
                  <p>
                    Bütçe: {list.budget.toLocaleString('tr-TR')} ₺
                  </p>
                  <p>
                    Toplam: {list.totalAmount.toLocaleString('tr-TR')} ₺
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedList(selectedList === list._id ? null : list._id)}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm transition-colors"
                >
                  {selectedList === list._id ? 'Gizle' : 'Ürünler'}
                </button>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
            {selectedList === list._id && (
              <ShoppingItems listId={list._id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShoppingItems({ listId }: { listId: Id<"shoppingLists"> }) {
  const { toast } = useToast();
  const items = useQuery(api.items.getItems, { listId }) || [];
  const addItem = useMutation(api.items.addItem);
  const updateItem = useMutation(api.items.updateItem);
  const deleteItem = useMutation(api.items.deleteItem);

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) {
      toast({
        title: "Hata",
        description: "Ürün adı ve fiyat gereklidir",
        variant: "destructive",
      });
      return;
    }

    try {
      await addItem({
        listId,
        name: newItemName,
        price: parseFloat(newItemPrice),
      });
      setNewItemName("");
      setNewItemPrice("");
      toast({
        title: "Başarılı",
        description: "Ürün eklendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün eklenemedi",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePrice = async (itemId: Id<"items">, newPrice: string) => {
    try {
      await updateItem({
        itemId,
        price: parseFloat(newPrice),
      });
      toast({
        title: "Başarılı",
        description: "Fiyat güncellendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Fiyat güncellenemedi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ürün Adı"
          className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            placeholder="Fiyat"
            className="w-full sm:w-24 px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 text-sm"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm transition-colors whitespace-nowrap"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-gray-700 rounded-md"
          >
            <span className="text-white text-sm">{item.name}</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                defaultValue={item.price}
                onBlur={(e) => handleUpdatePrice(item._id, e.target.value)}
                className="w-full sm:w-24 px-2 py-1.5 bg-gray-600 rounded text-white text-sm"
              />
              <span className="text-gray-400">₺</span>
              <button
                onClick={() => deleteItem({ itemId: item._id })}
                className="p-1.5 text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
