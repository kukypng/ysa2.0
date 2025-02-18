import React, { useState } from 'react';
import { ShoppingCart, MapIcon as WhatsappIcon, Star, MapPin, Heart, Wallet, Home, Truck } from 'lucide-react';

// Configuration object for easy updates
const CONFIG = {
  PHONE_NUMBER: '5564999421093', // Replace with your actual phone number
  DELIVERY: {
    MIN_ORDER_FREE_DELIVERY: 28, // Minimum order amount for free delivery
    FEE: 9, // Standard delivery fee
  },
  STORE_NAME: 'Cantinho Da Ysa',
};

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

type PaymentMethod = 'pix' | 'card' | 'cash' | '';
type DeliveryMethod = 'delivery' | 'pickup';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  reference: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Bolo de Brigadeiro",
    price: 14,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
    description: "Delicioso bolo de pote sabor Brigadeiro irresistível"
  },
  {
    id: 2,
    name: "Bolo de Prestigio",
    price: 14,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
    description: "Bolo Sabor prestigio com pedaços de coco fresco"
  },
  {
    id: 3,
    name: "Bolo de Ninho Com Nutella",
    price: 14,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80",
    description: "Bolo de leite Ninho com Nutella"
  },
];

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [affiliateName, setAffiliateName] = useState("Gabriela Miranda");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [changeAmount, setChangeAmount] = useState<string>('');
  const [showChangeInput, setShowChangeInput] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    reference: ''
  });

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (totalPrice >= CONFIG.DELIVERY.MIN_ORDER_FREE_DELIVERY ? 0 : CONFIG.DELIVERY.FEE);
  const finalPrice = totalPrice + deliveryFee;

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowChangeInput(method === 'cash');
    if (method !== 'cash') {
      setChangeAmount('');
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateOrder = () => {
    if (!paymentMethod) {
      alert('Por favor, selecione um método de pagamento');
      return false;
    }

    if (deliveryMethod === 'delivery') {
      if (!address.street || !address.number || !address.neighborhood) {
        alert('Por favor, preencha os campos obrigatórios do endereço');
        return false;
      }
    }

    if (paymentMethod === 'cash' && !changeAmount) {
      alert('Por favor, informe o valor para troco');
      return false;
    }

    return true;
  };

  const sendWhatsAppMessage = () => {
    if (!validateOrder()) return;

    const items = cart.reduce((acc, item) => {
      return acc + `\n- ${item.name}`;
    }, "");

    const paymentInfo = paymentMethod === 'cash' 
      ? `\nPagamento: Dinheiro (Troco para R$ ${changeAmount})`
      : `\nPagamento: ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'}`;

    const deliveryInfo = deliveryMethod === 'delivery'
      ? `\n\nEndereço de Entrega:
Rua: ${address.street}, ${address.number}
${address.complement ? `Complemento: ${address.complement}` : ''}
Bairro: ${address.neighborhood}
${address.reference ? `Ponto de referência: ${address.reference}` : ''}`
      : '\n\nRetirada no local';
    
    const message = `*${CONFIG.STORE_NAME}*
    
Itens:${items}

Subtotal: R$ ${totalPrice.toFixed(2)}
${deliveryMethod === 'delivery' ? `Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}` : 'Retirada no local'}
Total: R$ ${finalPrice.toFixed(2)}

Indicado por: ${affiliateName}${paymentInfo}${deliveryInfo}`;

    const whatsappLink = `https://wa.me/${CONFIG.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-pink-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{CONFIG.STORE_NAME}</h1>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-pink-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Affiliate Banner */}
      <div className="bg-pink-100 p-4">
        <div className="container mx-auto text-center">
          <p className="text-pink-800">
            <span className="font-semibold">Você está comprando através de: </span>
            {affiliateName}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nossos Bolos de Pote</h2>
          <p className="text-gray-600">Deliciosos bolos artesanais feitos com muito amor ❤️</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-pink-600">R$ {product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Seu Pedido</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b">
                <div>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            ))}

            {/* Delivery Method Selection */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Método de Entrega</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                    deliveryMethod === 'delivery' ? 'bg-pink-100 border-pink-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Entrega</span>
                </button>
                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                    deliveryMethod === 'pickup' ? 'bg-pink-100 border-pink-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Retirar no Local</span>
                </button>
              </div>
            </div>

            {/* Address Form */}
            {deliveryMethod === 'delivery' && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Endereço de Entrega</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Nome da rua"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={address.number}
                        onChange={(e) => handleAddressChange('number', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Número"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={address.complement}
                      onChange={(e) => handleAddressChange('complement', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Apartamento, bloco, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={address.neighborhood}
                      onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Nome do bairro"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      value={address.reference}
                      onChange={(e) => handleAddressChange('reference', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Próximo a..."
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Método de Pagamento</h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handlePaymentMethodChange('pix')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                    paymentMethod === 'pix' ? 'bg-pink-100 border-pink-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>PIX</span>
                </button>
                <button
                  onClick={() => handlePaymentMethodChange('card')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                    paymentMethod === 'card' ? 'bg-pink-100 border-pink-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Cartão</span>
                </button>
                <button
                  onClick={() => handlePaymentMethodChange('cash')}
                  className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                    paymentMethod === 'cash' ? 'bg-pink-100 border-pink-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Dinheiro</span>
                </button>
              </div>

              {showChangeInput && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Troco para quanto?
                  </label>
                  <input
                    type="number"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Digite o valor para troco"
                    min={finalPrice}
                  />
                </div>
              )}
            </div>

            <button
              onClick={sendWhatsAppMessage}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={paymentMethod === 'cash' && !changeAmount}
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>Fazer Pedido pelo WhatsApp</span>
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <MapPin className="w-8 h-8 text-pink-600" />
            <div>
              <h3 className="font-semibold">Entrega Grátis</h3>
              <p className="text-sm text-gray-600">Em pedidos acima de R$ {CONFIG.DELIVERY.MIN_ORDER_FREE_DELIVERY.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <Heart className="w-8 h-8 text-pink-600" />
            <div>
              <h3 className="font-semibold">Feito com Amor</h3>
              <p className="text-sm text-gray-600">Bolos artesanais deliciosos</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
            <Star className="w-8 h-8 text-pink-600" />
            <div>
              <h3 className="font-semibold">Qualidade Garantida</h3>
              <p className="text-sm text-gray-600">Satisfação garantida</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{CONFIG.STORE_NAME}</h2>
          <p className="mb-4">Bolos artesanais feitos com amor ❤️</p>
          <p className="text-gray-400">© 2025 {CONFIG.STORE_NAME}.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
