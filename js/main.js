class Producto {
    constructor ({id,nombre,precio,imagen},cantidad=0){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = cantidad;
    }

    card (){
        return `
            <div class="col-12 col-sm-4"> 
                <div class="imgprod1">                    
                    <img src="./img/Img-prodductos/${this.imagen}" alt="" class="imgprod">                       
                </div>
                <div class="texto2 imgdec">${this.nombre}</div>
                <h4 class="texto2 imgdec">$${this.precio}</h4>
                <button class="botonesAniadir titulo4" data-action="agregarProductoAlCarrito" data-id=${this.id}> Añadir </button>
            </div>`
    }

    cardCarrito(){
        return `
        <li> 
            <b>${this.nombre}</b> 
            <button class="botonesRemover imgdec" data-action="reducirCantidadDeProducto" data-id=${this.id}>-</button>
            <b>${this.cantidad}<b>
            <button class="botonesRemover imgdec" data-action="agregarProductoAlCarrito" data-id=${this.id}>+</button>
            <button class="botonesRemover imgdec" data-action="removerProducto" data-id=${this.id}>X</button>
        </li>`
        
    }
}

class Tienda {
    constructor(listado){
        this.stock = [];
        this.carrito = [];
        this.total = 0;
        listado && this.agregarListadoAlStock(listado);
    }

    interfaz = () => (e) => this[e.target.dataset.action](e.target.dataset.id);

    agregarProductoAlStock = (producto) => this.stock.push(new Producto(producto));

    agregarListadoAlStock = (listado) => {
        listado.forEach(item => this.agregarProductoAlStock(item));
        this.renderStock();
    }

    productoEnCarrito = (id) => this.carrito.findIndex(producto => producto.id == id);

    reducirCantidadDeProducto = (id) => this.agregarProductoAlCarrito(id, -1);

    agregarProductoAlCarrito = (id, direccion = 1) => {
        let index = this.productoEnCarrito(id);
        if (index == -1){
            this.carrito.push(new Producto(this.devolverProductoPorId(id), 1));
        } else{ 
            this.carrito[index].cantidad += direccion;
            this.carrito[index].cantidad == 0 && this.removerProducto(id);
        } 
        this.renderCarrito();
    }

    devolverProductoPorId = (id) => this.stock.find(item => item.id == id);

    renderCarrito = () => {
        this.calcularTotal();
        $("#carrito").html(this.carrito.map(item => item.cardCarrito()).join(""));
        this.carrito.length == 0 && $("#carrito").html("<li>Carrito vacio</li>");
        $(".botonesRemover").click(manejarCarrito);
    }

    finalizarCompra = () => {
        $("#carrito").html("<li>Gracias por su compra!</li>");
        this.carrito = [];
        this.calcularTotal();
    }

    renderStock = () => {
        $("#productos").html(this.stock.map(item => item.card()).join("<br/>"));
        $(".botonesAniadir").click(manejarCarrito);
        this.renderCarrito();
    } 
    
    calcularTotal = () => {
        this.total = this.carrito.reduce((a,b) => a + (b.precio * b.cantidad), 0);
        $("#destino").html("El total de su compra es: $" + this.total );
        this.total == 0 && $("#destino").html("");
    };

    removerProducto = (id) => {
        this.carrito = this.carrito.filter(item => item.id != id);
        this.renderCarrito("carrito");
    }    
}

let bazar = new Tienda()
const manejarCarrito = bazar.interfaz()

fetch('productos.json')
  .then(response => response.json())
  .then(bazar.agregarListadoAlStock)


